<template>

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



  <section class="result-section">
      <div class="result-page">
        <h1>Your Test Results</h1>
        <p v-if="correctAnswers !== null">Correct Answers: <strong>{{ correctAnswers }}</strong> out of <strong>{{ totalQuestions }}</strong></p>
        <button @click="startTestAgain" class="btn btn-primary">Start Test Again</button>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        correctAnswers: null,
        totalQuestions: 0
      };
    },
    mounted() {
      this.correctAnswers = parseInt(this.$route.query.correctAnswers, 20) || 0;
      this.totalQuestions = parseInt(this.$route.query.totalQuestions, 0) || 0;
    },
    methods: {
      startTestAgain() {
        this.$router.push('/');
      }
    }
  };
  </script>
  
<style>

.result-section{
  margin-top: 90px;
  display: flex;
  justify-content: center;
  align-items: center
}

.result-page{
  width: 50%;
  height: 300px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  box-shadow: 10px;
}
.result-page h1{
  font-family: sans-serif;
}

.result-page button{
  width: 20%;
  margin-left: 40%;
  padding: 10px;
}
.result-page p{
  font-size: 18px;
  font-family: cursive;
  padding: 15px;
}

@media (max-width: 768px) {
  .result-page {
    width: 100%;
  }
  .result-page button{
    width: 40%;
    margin-left: 30%;
}
.result-page{
  font-size: 14px;
} 
}

@media(max-width: 1024px){
  .result-page button{
    width: 40%;
    margin-left: 30%;
  }
}
</style>