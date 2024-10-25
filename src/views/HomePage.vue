<template>

  <header> 
      <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
          <div class="container-fluid">
              <a class="navbar-brand" href="#">Navbar w/ text</a>
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

  <div class="content">
    <h1>Выберите билет</h1>
    <div class="all-tests">
      <div class="billet-list">
        <div class="billet-grid">
          <div v-for="billet in info" :key="billet.id" class="billet" @click="goToTests(billet.id)">
            <strong>Билет:</strong> {{ billet.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';


export default {
  data() {
    return {
      info: null,
      token: null
    }
  },
  mounted() {
    this.authenticateUser();
  },
  methods: {
    async authenticateUser() {
    try {
      const response = await axios.post('http://localhost:8000/jwt/token/', {
        telegram_id: '2004',
        password: '1234'    
      });
      this.token = response.data.access;

      localStorage.setItem('token', this.token);
      
      this.fetchBillets(); 
    } catch (error) {
      console.error('Error during authentication:', error.response ? error.response.data : error.message);
    }
  },
    async fetchBillets() {
      try {
        const response = await axios.get('http://localhost:8000/billets/', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        this.info = response.data.map(billet => ({
          id: billet.id,
          number: billet.number,
          description: billet.description
        })).sort((a, b) => a.id - b.id);  
      } catch (error) {
        console.error('Error fetching billets:', error.response ? error.response.data : error.message);
      }
    },
    goToTests(billetId) {
      this.$router.push({ name: 'TestPage', params: { billetId } });
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  padding-top: 40px;
}
.navbar-brand {
  margin-left: 10%;
}
.navbar-collapse {
  margin: 10px 5%;
}
.navbar {
    box-shadow: 10px 2px 0px rgba(0, 0, 0, 0.1);
}

.all-tests {
  padding: 20px;
}

.billet-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr); /* 10 billets per row */
  grid-gap: 10px; 
}

.billet {
  cursor: pointer;
  padding: 20px;
  border: 1px solid #ccc;
  text-align: center;
}
.billet:hover {
  background-color: #4aa926;
  color: #fff;
}

.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
}
.content h1{
  margin-bottom: 30px;
  font-family: initial;
  color: #4b4b4e;
}

@media (max-width: 1200px) {
  .billet-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 768px) {
  .billet-grid {
    grid-template-columns: repeat(2, 1fr); 
  }

  .content {
    text-align: center;
  }
}
</style>
