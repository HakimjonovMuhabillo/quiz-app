<template>
  <div>
    <header> 
      <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
          <div class="container-fluid">
              <router-link to="/" class="navbar-brand" href="#">Navbar w/ text</router-link>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
                      aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarText">
                  <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>

                  <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link">uz</a>
                      </li>
                      <li class="nav-item dropdown">
                          <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user"></i>
                          </a>

                          <ul class="dropdown-menu dropdown-menu-end">
                              <li><router-link to="/account" class="dropdown-item" href="#">My account</router-link></li>
                              <li><a class="dropdown-item" href="#">Subscription</a></li>
                              <li><a class="dropdown-item" href="#">User Payment</a></li>
                          </ul>
                      </li>
                  </ul>
              </div>
          </div>  
      </nav>
  </header>

    <section class="account">
      <div class="account-info" v-if="user">
        <img :src="image">
        <h4>Phone: {{ user.phone }}</h4>
        <p>Email: {{ user.email }}</p>
      </div>
      <div v-else>
        <p>Loading account information...</p>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import personImge from '@/assets/person (1).png'

export default {
  data() {
    return {
      image: personImge,
      user: null,
      token: localStorage.getItem('token')
    };
  },
  mounted() {
    this.fetchUserInfo(); 
  },
  methods: {
    async fetchUserInfo() {
      try {
        const response = await axios.get('http://localhost:8000/users/', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        this.user = response.data[0]; 
        console.log('Fetched user info:', this.user); 

      } catch (error) {
        console.error('Error fetching user info:', error.response ? error.response.data : error.message);
      }
    }
  }
}
</script>

<style scoped>
.account-info {
  padding: 20px;
  max-width: 800px;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.account-info h4 {
  margin-top: 15px;
}
.account-info p {
  padding: 5px;
}

</style>
