import fetch from 'node-fetch';

const API_BASE = 'http://localhost:8080';

// Test kullanıcıları
const testData = {
  customer: {
    name: 'Ahmet Yılmaz',
    email: 'customer@test.com',
    password: 'password123',
    role: 'CUSTOMER'
  },
  restaurantOwner: {
    name: 'Mehmet Özkan',
    email: 'owner@test.com',
    password: 'password123',
    role: 'RESTAURANT_OWNER'
  }
};

// Customer profil bilgileri
const customerProfile = {
  phoneNumber: '+905551234567'
};

const customerAddress = {
  city: 'Istanbul',
  district: 'Kadikoy', 
  street: 'Bagdat Caddesi',
  neighbourhood: 'Fenerbahce',
  number: '123'
};

// Restaurant bilgileri
const restaurantInfo = {
  name: 'Lezzet Durağı',
  description: 'Geleneksel Türk mutfağının en lezzetli yemekleri',
  min_order_price: 50.00
};

async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  if (token) {
    options.headers['Cookie'] = `token=${token}`;
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      console.error(`❌ API Error (${response.status}):`, result);
      return null;
    }
    
    // Token'ı response header'dan çıkar
    let extractedToken = token;
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      const tokenMatch = setCookie.match(/token=([^;]+)/);
      if (tokenMatch) {
        extractedToken = tokenMatch[1];
      }
    }
    
    return { data: result, token: extractedToken };
  } catch (error) {
    console.error(`❌ Network Error:`, error.message);
    return null;
  }
}

async function registerUser(userData) {
  console.log(`\n📝 Kullanıcı kaydı: ${userData.name} (${userData.role})`);
  console.log(`   Email: ${userData.email}`);
  
  const result = await apiRequest('/auth/register', 'POST', userData);
  
  if (result) {
    console.log(`✅ Kayıt başarılı: ID ${result.data.id}`);
    return result;
  }
  
  console.log(`❌ Kayıt başarısız`);
  return null;
}

async function loginUser(email, password) {
  console.log(`\n🔐 Giriş yapılıyor: ${email}`);
  
  const result = await apiRequest('/auth/login', 'POST', { email, password });
  
  if (result) {
    console.log(`✅ Giriş başarılı: ${result.data.name}`);
    return result;
  }
  
  console.log(`❌ Giriş başarısız`);
  return null;
}

async function addCustomerPhone(token, phoneData) {
  console.log(`\n📞 Telefon ekleniyor: ${phoneData.phoneNumber}`);
  
  const result = await apiRequest('/customer/phone', 'POST', phoneData, token);
  
  if (result) {
    console.log(`✅ Telefon eklendi`);
    return result;
  }
  
  console.log(`❌ Telefon eklenemedi`);
  return null;
}

async function addCustomerAddress(token, addressData) {
  console.log(`\n🏠 Adres ekleniyor: ${addressData.city}/${addressData.district}`);
  
  const result = await apiRequest('/customer/address', 'POST', addressData, token);
  
  if (result) {
    console.log(`✅ Adres eklendi`);
    return result;
  }
  
  console.log(`❌ Adres eklenemedi`);
  return null;
}

async function addRestaurantInfo(token, restaurantData) {
  console.log(`\n🍕 Restaurant bilgisi ekleniyor: ${restaurantData.name}`);
  
  const result = await apiRequest('/restaurant/info', 'POST', restaurantData, token);
  
  if (result) {
    console.log(`✅ Restaurant bilgisi eklendi`);
    return result;
  }
  
  console.log(`❌ Restaurant bilgisi eklenemedi`);
  return null;
}

async function main() {
  console.log('🚀 Test verisi oluşturma başlatılıyor...');
  console.log('=' * 60);
  
  try {
    // 1. Customer kaydet
    const customerReg = await registerUser(testData.customer);
    if (!customerReg) return;
    
    // 2. Restaurant Owner kaydet  
    const ownerReg = await registerUser(testData.restaurantOwner);
    if (!ownerReg) return;
    
    console.log('\n' + '='.repeat(60));
    console.log('👤 CUSTOMER İŞLEMLERİ');
    console.log('='.repeat(60));
    
    // 3. Customer login ve profil bilgileri ekle
    const customerLogin = await loginUser(testData.customer.email, testData.customer.password);
    if (customerLogin) {
      await addCustomerPhone(customerLogin.token, customerProfile);
      await addCustomerAddress(customerLogin.token, customerAddress);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🍕 RESTAURANT İŞLEMLERİ');
    console.log('='.repeat(60));
    
    // 4. Restaurant Owner login ve restaurant bilgileri ekle
    const ownerLogin = await loginUser(testData.restaurantOwner.email, testData.restaurantOwner.password);
    if (ownerLogin) {
      await addRestaurantInfo(ownerLogin.token, restaurantInfo);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 TEST VERİSİ OLUŞTURMA TAMAMLANDI!');
    console.log('='.repeat(60));
    console.log('\n📋 GİRİŞ BİLGİLERİ:');
    console.log(`👤 Customer: ${testData.customer.email} / ${testData.customer.password}`);
    console.log(`🍕 Restaurant Owner: ${testData.restaurantOwner.email} / ${testData.restaurantOwner.password}`);
    console.log('\n💡 Bu bilgilerle Postman\'da test edebilirsiniz!');
    
  } catch (error) {
    console.error('\n❌ Script hatası:', error.message);
  }
}

// Script'i çalıştır
main();