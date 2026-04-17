import { NextResponse } from 'next/server';
import crypto from 'crypto';
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
    const signature = request.headers.get('pagarme-signature');
    const bodyText = await request.text();
    const webhookSecret = process.env.PAGARME_WEBHOOK_SECRET || process.env.PAGARME_API_KEY;

    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyText)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(bodyText);

    // Handle different event types
    const { type, data } = event;

    if (type === 'order.paid' || type === 'order.payment_failed' || type === 'charge.chargedback') {
      const userId = data.metadata?.userId;
      const transactionId = data.metadata?.transactionId;

      if (userId && transactionId && PROJECT_ID) {
        let newStatus = 'pendente';
        if (type === 'order.paid') newStatus = 'aprovado';
        if (type === 'order.payment_failed') newStatus = 'recusado';
        if (type === 'charge.chargedback') newStatus = 'reembolsado';

        const token = await getAuthToken();
        
        // We use updateMask to only update specific fields
        const documentData = {
          fields: {
            status: { stringValue: newStatus },
            updatedAt: { timestampValue: new Date().toISOString() },
          }
        };

        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/users/${userId}/transactions/${transactionId}?updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt`;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(firestoreUrl, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(documentData),
        });

        if (!response.ok) {
          console.error('Failed to update transaction in Firestore:', await response.text());
        }

        // Se pago, libera o acesso criando um courseEnrollments
        if (newStatus === 'aprovado' && data.customer?.email) {
          const enrollmentData = {
            fields: {
              studentEmail: { stringValue: data.customer.email },
              studentName: { stringValue: data.customer.name || 'Aluno' },
              courseId: { stringValue: data.metadata?.checkoutId || 'unknown' },
              sellerId: { stringValue: userId },
              transactionId: { stringValue: transactionId },
              status: { stringValue: 'active' },
              createdAt: { timestampValue: new Date().toISOString() },
            }
          };
          const enrollmentId = `enroll_${transactionId}`;
          const enrollmentUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/courseEnrollments/${enrollmentId}`;
          
          await fetch(enrollmentUrl, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(enrollmentData),
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
