import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';

export interface Transaction {
  id: string;
  checkoutId: string;
  cliente: string;
  email: string;
  produto: string;
  valor: number;
  status: 'aprovado' | 'pendente' | 'recusado' | 'reembolsado';
  metodo: 'pix' | 'cartao' | 'boleto';
  createdAt: string;
  updatedAt?: string;
}

export function useVendas(periodo: 'hoje' | 'semana' | 'mes' | 'todos' = 'todos') {
  const { user } = useAuth();
  const [vendas, setVendas] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setVendas([]);
      setLoading(false);
      return;
    }

    const fetchVendas = async () => {
      setLoading(true);
      setError(null);
      try {
        const vendasRef = collection(db, `users/${user.uid}/transactions`);
        const q = query(vendasRef, orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedVendas: Transaction[] = [];
          snapshot.forEach((doc) => {
            fetchedVendas.push(doc.data() as Transaction);
          });

          // Filter by period
          const now = new Date();
          const filteredVendas = fetchedVendas.filter(venda => {
            if (periodo === 'todos') return true;
            
            const vendaDate = new Date(venda.createdAt);
            const diffTime = Math.abs(now.getTime() - vendaDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (periodo === 'hoje') return diffDays <= 1;
            if (periodo === 'semana') return diffDays <= 7;
            if (periodo === 'mes') return diffDays <= 30;
            
            return true;
          });

          setVendas(filteredVendas);
          setLoading(false);
        }, (error) => {
           console.error("Firestore onSnapshot transaction error:", error);
           setError(error.message);
           setLoading(false);
        });

        // Set an effect return for cleaning up
        // Notice we don't return unsubscribe from an async function that isn't the outer effect callback.
        // It's better to store it if we want cleanup.
        return unsubscribe;
      } catch (err: any) {
        console.error("Erro ao buscar vendas:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    const unsubscribePromise = fetchVendas();
    return () => {
      unsubscribePromise.then(unsub => {
        if (unsub) unsub();
      });
    };
  }, [user, periodo]);

  const metricas = {
    faturamento: vendas.filter(v => v.status === 'aprovado').reduce((acc, curr) => acc + curr.valor, 0),
    vendasAprovadas: vendas.filter(v => v.status === 'aprovado').length,
    vendasPendentes: vendas.filter(v => v.status === 'pendente').length,
    vendasReembolsadas: vendas.filter(v => v.status === 'reembolsado').length,
    ticketMedio: 0,
    taxaAprovacao: 0,
  };

  if (metricas.vendasAprovadas > 0) {
    metricas.ticketMedio = metricas.faturamento / metricas.vendasAprovadas;
  }

  if (vendas.length > 0) {
    metricas.taxaAprovacao = Math.round((metricas.vendasAprovadas / vendas.length) * 100);
  }

  return { vendas, loading, error, metricas };
}
