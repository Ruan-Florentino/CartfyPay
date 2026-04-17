import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const DATABASE_ID = process.env.FIREBASE_DATABASE_ID || '(default)';
const SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

async function getAuthToken() {
  if (!SERVICE_ACCOUNT_KEY) return null;
  try {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/datastore',
      credentials: JSON.parse(SERVICE_ACCOUNT_KEY),
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { method, amount, customer, card_token, installments, userId, checkoutId, orderBump, utms } = await request.json();
    const apiKey = process.env.PAGARME_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Pagar.me API Key not configured' }, { status: 500 });
    }

    const auth = Buffer.from(`${apiKey}:`).toString('base64');
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const items = [
      {
        amount: Math.round((amount - (orderBump ? orderBump.price : 0)) * 100),
        description: 'Checkout Cartfy',
        quantity: 1,
      }
    ];

    if (orderBump) {
      items.push({
        amount: Math.round(orderBump.price * 100),
        description: orderBump.title,
        quantity: 1,
      });
    }

    const orderData: any = {
      items,
      customer: {
        name: customer.name,
        email: customer.email,
        document: customer.document,
        type: 'individual',
        phones: {
          mobile_phone: {
            country_code: '55',
            area_code: customer.phone.substring(0, 2),
            number: customer.phone.substring(2),
          },
        },
      },
      payments: [
        {
          payment_method: method === 'pix' ? 'pix' : method === 'boleto' ? 'boleto' : 'credit_card',
        },
      ],
      metadata: {
        userId: userId || 'anonymous',
        checkoutId: checkoutId || 'unknown',
        transactionId: transactionId,
        ...utms
      }
    };

    if (method === 'pix') {
      orderData.payments[0].pix = {
        expires_in: 3600,
      };
    } else if (method === 'boleto') {
      orderData.payments[0].boleto = {
        instructions: 'Pagar até o vencimento',
        due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      };
    } else if (method === 'cartao') {
      if (!card_token) {
        return NextResponse.json({ error: 'Token do cartão não fornecido' }, { status: 400 });
      }
      orderData.payments[0].credit_card = {
        recurrence: false,
        installments: installments || 1,
        statement_descriptor: 'CARTFY',
        card_token: card_token,
      };
    }

    const response = await fetch('https://api.pagar.me/core/v5/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Pagar.me Error:', data);
      return NextResponse.json({ error: data.message || 'Erro ao processar pagamento' }, { status: response.status });
    }

    const charge = data.charges[0];
    const payment = charge.last_transaction;
    const status = charge.status; // 'paid', 'pending', etc.

    // Save transaction to Firestore if userId is provided
    if (userId && PROJECT_ID) {
      const token = await getAuthToken();
      
      const firestoreUtms: any = {};
      if (utms) {
        Object.keys(utms).forEach(key => {
          firestoreUtms[key] = { stringValue: utms[key] };
        });
      }

      const documentData: any = {
        fields: {
          id: { stringValue: transactionId },
          checkoutId: { stringValue: checkoutId || '' },
          cliente: { stringValue: customer.name },
          email: { stringValue: customer.email },
          produto: { stringValue: 'Checkout Cartfy' },
          valor: { doubleValue: amount },
          status: { stringValue: status === 'paid' ? 'aprovado' : 'pendente' },
          metodo: { stringValue: method },
          createdAt: { timestampValue: new Date().toISOString() },
          utms: { mapValue: { fields: firestoreUtms } }
        }
      };

      if (orderBump) {
        documentData.fields.orderBump = {
          mapValue: {
            fields: {
              title: { stringValue: orderBump.title },
              price: { doubleValue: orderBump.price }
            }
          }
        };
      }

      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/users/${userId}/transactions/${transactionId}`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(firestoreUrl, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(documentData),
      }).catch(err => console.error('Failed to save transaction to Firestore:', err));
    }

    if (method === 'pix') {
      return NextResponse.json({
        qr_code: payment.qr_code,
        qr_code_url: payment.qr_code_url,
        expires_at: payment.expires_at,
        transactionId,
      });
    } else if (method === 'boleto') {
      return NextResponse.json({
        barcode: payment.barcode,
        pdf: payment.pdf,
        transactionId,
      });
    } else {
      return NextResponse.json({
        status: charge.status,
        id: charge.id,
        transactionId,
      });
    }
  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
