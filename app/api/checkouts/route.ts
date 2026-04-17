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
    const { id, config, userId } = await request.json();
    
    if (!id || !config || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!PROJECT_ID) {
      return NextResponse.json({ error: 'Firebase Project ID not configured' }, { status: 500 });
    }

    const token = await getAuthToken();

    // Add userId to config for ownership
    const documentData = {
      fields: {
        userId: { stringValue: userId },
        config: { 
          mapValue: {
            fields: Object.entries(config).reduce((acc: any, [key, value]: [string, any]) => {
              if (typeof value === 'string') acc[key] = { stringValue: value };
              else if (typeof value === 'number') acc[key] = { doubleValue: value };
              else if (typeof value === 'boolean') acc[key] = { booleanValue: value };
              else acc[key] = { stringValue: JSON.stringify(value) }; // Fallback for complex objects
              return acc;
            }, {})
          }
        }
      }
    };

    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/checkouts/${id}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'PATCH', // PATCH with id works as upsert
      headers,
      body: JSON.stringify(documentData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Firestore REST Error:', error);
      return NextResponse.json({ error: 'Failed to save to Firestore', details: error }, { status: response.status });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error saving checkout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    if (!PROJECT_ID) {
      return NextResponse.json({ error: 'Firebase Project ID not configured' }, { status: 500 });
    }

    const token = await getAuthToken();
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/checkouts/${id}`;
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Checkout not found' }, { status: 404 });
      }
      const error = await response.json();
      console.error('Firestore REST Error:', error);
      return NextResponse.json({ error: 'Failed to fetch from Firestore' }, { status: response.status });
    }

    const data = await response.json();
    
    // Helper to parse Firestore REST format back to plain object
    const parseFields = (fields: any) => {
      const result: any = {};
      for (const key in fields) {
        const value = fields[key];
        if (value.stringValue !== undefined) {
          try {
            result[key] = JSON.parse(value.stringValue);
          } catch {
            result[key] = value.stringValue;
          }
        }
        else if (value.doubleValue !== undefined) result[key] = parseFloat(value.doubleValue);
        else if (value.integerValue !== undefined) result[key] = parseInt(value.integerValue);
        else if (value.booleanValue !== undefined) result[key] = value.booleanValue;
        else if (value.mapValue !== undefined) result[key] = parseFields(value.mapValue.fields);
      }
      return result;
    };

    const config = parseFields(data.fields.config.mapValue.fields);

    return NextResponse.json({ config });
  } catch (error) {
    console.error('Error getting checkout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
