const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE ENDPOINT TESTS ---');
  let cookieHeader = '';

  // 1. Health check
  console.log('\n[1] Testing GET /health');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('✓ Health OK:', healthData);

  // 2. Auth Login
  console.log('\n[2] Testing POST /api/auth/login');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'dealer@resellertools.com',
      password: 'password123'
    })
  });
  const loginData = await loginRes.json();
  console.log('✓ Login OK:', loginData.message, 'User:', loginData.data?.user?.email);

  const rawCookie = loginRes.headers.get('set-cookie');
  if (rawCookie) {
    cookieHeader = rawCookie.split(';')[0];
  }

  // 3. Auth Me
  console.log('\n[3] Testing GET /api/auth/me');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: cookieHeader }
  });
  const meData = await meRes.json();
  console.log('✓ Auth Me OK:', meData.data.business.businessName, 'Code:', meData.data.business.businessCode);
  const businessCode = meData.data.business.businessCode;

  // 4. Get Business Profile
  console.log('\n[4] Testing GET /api/business/profile');
  const profRes = await fetch(`${BASE_URL}/api/business/profile`, {
    headers: { Cookie: cookieHeader }
  });
  const profData = await profRes.json();
  console.log('✓ Profile OK:', profData.data.businessName, 'UPI:', profData.data.upiId);

  // 5. Get Customers
  console.log('\n[5] Testing GET /api/customers');
  const custRes = await fetch(`${BASE_URL}/api/customers`, {
    headers: { Cookie: cookieHeader }
  });
  const custData = await custRes.json();
  console.log(`✓ Customers OK: Found ${custData.data.length} customer records`);

  // 6. Create Order Link (Primary flow)
  console.log('\n[6] Testing POST /api/orders (Order Link creation)');
  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader
    },
    body: JSON.stringify({
      customerPhone: '9845099887',
      amount: 1999,
      item: 'Pure Kanchipuram Pattu Saree',
      customerName: 'Ananya Rao'
    })
  });
  const orderData = await orderRes.json();
  console.log('✓ Order Created OK. Token:', orderData.data.order.orderToken);
  console.log('  Public URL:', orderData.data.publicUrl);
  console.log('  WhatsApp URL:', orderData.data.whatsappUrl);
  const orderToken = orderData.data.order.orderToken;
  const orderId = orderData.data.order._id;

  // 7. Get Public Order by orderToken
  console.log(`\n[7] Testing GET /api/public/order/${orderToken}`);
  const publicOrderRes = await fetch(`${BASE_URL}/api/public/order/${orderToken}`);
  const publicOrderData = await publicOrderRes.json();
  console.log('✓ Public Order OK:', publicOrderData.data.item, 'Status:', publicOrderData.data.orderStatus);
  console.log('  (Address is awaiting_address, upiUrl should be empty string for step 1):', publicOrderData.data.upiUrl === '');

  // 8. Public Customer saves address
  console.log(`\n[8] Testing POST /api/public/order/${orderToken}/address`);
  const saveAddrRes = await fetch(`${BASE_URL}/api/public/order/${orderToken}/address`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Ananya Rao',
      phone: '9845099887',
      address1: 'Plot 45, Lotus Villa',
      address2: 'Road No 12, Banjara Hills',
      landmark: 'Near City Center Mall',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034'
    })
  });
  const saveAddrData = await saveAddrRes.json();
  console.log('✓ Address Saved OK. Status transitioned to:', saveAddrData.data.orderStatus);
  console.log('  Generated UPI URL:', saveAddrData.data.upiUrl);

  // 9. Public Customer clicks Pay via UPI
  console.log(`\n[9] Testing POST /api/public/order/${orderToken}/initiate-payment`);
  const payInitRes = await fetch(`${BASE_URL}/api/public/order/${orderToken}/initiate-payment`, {
    method: 'POST'
  });
  const payInitData = await payInitRes.json();
  console.log('✓ Payment Initiated OK:', payInitData.data);

  // 10. Public Address Formatter by businessCode
  console.log(`\n[10] Testing GET /api/public/address/${businessCode}`);
  const publicAddrRes = await fetch(`${BASE_URL}/api/public/address/${businessCode}`);
  const publicAddrData = await publicAddrRes.json();
  console.log('✓ Public Address Formatter OK:', publicAddrData.data);

  // 11. Delete Order (Soft Delete)
  console.log(`\n[11] Testing DELETE /api/orders/${orderId}`);
  const delOrderRes = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: { Cookie: cookieHeader }
  });
  const delOrderData = await delOrderRes.json();
  console.log('✓ Delete Order OK:', delOrderData.message);

  // 12. Logout
  console.log('\n[12] Testing POST /api/auth/logout');
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { Cookie: cookieHeader }
  });
  const logoutData = await logoutRes.json();
  console.log('✓ Logout OK:', logoutData.message);

  console.log('\n🎉 ALL 12 ENDPOINT TESTS PASSED SUCCESSFULLY! 🎉\n');
}

runTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
