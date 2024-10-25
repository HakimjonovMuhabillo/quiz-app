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




  <section class="main-test">
    <div>
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent="prevPage">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" 
              :class="[
                { active: page === currentPage }, 
                { 'correct-page': answerStates[page]?.isCorrect === true },
                { 'incorrect-page': answerStates[page]?.isCorrect === false }
              ]">
            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" aria-label="Next" @click.prevent="nextPage">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="timer text-center my-3">
        <p class="timer-square">{{ formattedTimeLeft }}</p>
      </div>

      <div v-if="tests && tests.length">
        <div v-for="(test) in paginatedTests" :key="test.id" class="test-item">
          <p>{{ test.question }}</p>
          <button class="ms-2" @click="endTest">Test End</button>

          <div class="test-content" :class="{ 'no-image': !test.photo }">
            <div class="test-photo" v-if="test.photo">
              <img :src="test.photo" alt="Test Photo" class="img-fluid" />
            </div>

            <div class="test-options">
              <div class="options-column">
                <button 
                  v-for="choice in test.choices" 
                  :key="choice.id" 
                  class="btn flex-fill"
                  :class="{
                    'btn-outline-primary': !selectedAnswers[test.id],
                    'btn-success': selectedAnswers[test.id] === choice.id && choice.is_correct,
                    'btn-danger': selectedAnswers[test.id] === choice.id && !choice.is_correct,
                    'disabled': !!selectedAnswers[test.id]
                  }"
                  :disabled="!!selectedAnswers[test.id]" 
                  @click="selectAnswer(test.id, choice.id, choice.is_correct)"
                >
                  {{ choice.variant }}: {{ choice.text }}
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>

      <div v-else>
        <p>Тесты не найдены для данного билета</p>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tests: [],
      token: null,
      billetId: this.$route.params.billetId,
      currentPage: 1,
      itemsPerPage: 1, 
      timeLeft: 1500, 
      timer: null,
      selectedAnswers: {}, 
      answerStates: {} 
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.tests.length / this.itemsPerPage);
    },
    paginatedTests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.tests.slice(start, start + this.itemsPerPage);
    },
    formattedTimeLeft() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
  },
  mounted() {
    this.authenticateUser();
    this.startTimer();
  },
  beforeUnmount() { 
    clearInterval(this.timer);
  },
  methods: {
    async authenticateUser() {
      try {
        const response = await axios.post('http://localhost:8000/jwt/token/', {
          telegram_id: '2004',
          password: '1234',
        });
        this.token = response.data.access;
        this.fetchTests();  
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    },
    async fetchTests() {
      try {
        const response = await axios.get('http://localhost:8000/tests/', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.tests = response.data.filter(test => test.choices.some(choice => choice.billet == this.billetId));

        if (!this.tests.length) {
          console.error('No tests found for this billet');
        }
      } catch (error) {
        console.error('Error fetching tests:', error.response ? error.response.data : error.message);
      }
    },
    startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.endTest(); 
      }
    }, 1000);
  },
  endTest() {
  clearInterval(this.timer);

  const correctAnswers = Object.values(this.answerStates).filter(state => state.isCorrect).length;
  const totalQuestions = this.tests.length;

      this.$router.push({
        name: 'ResultPage',
        query: { correctAnswers, totalQuestions }
      });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    selectAnswer(testId, choiceId, isCorrect) {
      if (!this.selectedAnswers[testId]) {
        this.selectedAnswers[testId] = choiceId;

        this.answerStates[this.currentPage] = { isCorrect };
      }
    },
  },
};
</script>

<style>
.correct-page a {
  background-color: green !important;
  color: white !important;
}
.incorrect-page a {
  background-color: red !important;
  color: white !important;
}
.test-item {
  padding: 20px 40px;
}
.test-item p{
  font-size: 25px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
}
.main-test {
  padding: 20px; 
  overflow-y: auto;
  min-height: 100vh;
}

.test-content {
  display: flex;
  margin-top: 40px;
}

.test-photo {
  flex: 1;
  margin-right: 20px; 
  height: 350px; 
}
.test-photo img {
  height: 100%;
  width: 90%;
}

.test-options {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
}

.options-column {
  display: flex;
  flex-direction: column;
  height: 70%;
}

.options-column button {
  flex: 1;
  margin-top: 10px;
}
.timer-square{
  padding-top: 20px;
  color: #444;
  font-size: 20px;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}

.pagination {
  display: flex;       
  flex-wrap: wrap;       
  justify-content: center; 
  margin: 0;             
  padding: 0;          
  list-style-type: none; 
}






.disabled {
  pointer-events: none;
  opacity: 0.6; 
}

.btn-success {
  background-color: green;
}

.btn-danger {
  background-color: red;
}

.btn-success.disabled {
  background-color: green; 
  opacity: 0.6; 
}

.btn-danger.disabled {
  background-color: red;
  opacity: 0.6; 
}

@media (max-width: 768px) {
  .test-content {
    flex-direction: column; 
  }
  .test-photo {
    margin-right: 0; 
    margin-bottom: 20px; 
  }
  .test-photo img {
    height: 250px;
  }
  .test-item p {
    font-size: 10px;
    padding: 0;
  }
  .test-item button{
    padding: 5px;
    font-size: 10px;
  }
  .timer-square{
    padding: 0;
  }
  .test-photo{
    padding: 0;
  }
}
</style>  
