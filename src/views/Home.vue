<template>

<v-app>
    <div class="backgruond"></div>
    <v-main class="d-flex justify-center align-center">
      <v-col cols="10" lg="4" class="mx-auto">
        <v-card class="pa-4">
          <div class="text-center">
            <!-- <v-avatar size="100" color="indigo lighten-4"> -->
              <i class="bx bxl-codepen icon"></i>
            <!-- </v-avatar> -->
            <h2 class="indigo--text">Welcome!</h2>
          </div>
          <v-form @submit.prevent="submitHandler" >
            <v-card-text>
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                type="text"
                label="Username"
                placeholder="Username"
                prepend-inner-icon="mdi-account"
                required
              />
              <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      :type="passwordShow?'text':'password'"
                      label="Password"
                      placeholder="Password"
                      prepend-inner-icon="mdi-key"
                      :append-icon="passwordShow ? 'mdi-eye':'mdi-eye-off'"
                      @click:append="passwordShow = !passwordShow"
                      required
              />
           
            </v-card-text>
            <v-card-actions class="justify-center">

              <v-btn :loading="loading" type="submit" color="#f44064" class="btn">
                <span class=" px-8">Login</span>
              </v-btn>
            </v-card-actions>
            <p :class="{'red':isError,'showErr':showErr}">Incorrect Credentials</p>
          </v-form>
        </v-card>
      </v-col>
    </v-main>
  </v-app>
    <router-view></router-view>
</template>
<script src="./js/home">

</script>
<style scoped>

.showErr{
  display: none;
}
/* .red{
    color:red;
    text-align: center;
    margin: 0;


} */
.v-card{
  border-left: 50px solid #f44064;
}
.backgruond{

    height: 300px;
    width: 100%;
    display: block;
    position: absolute;
    top: 0;
    background-size: cover;
  }
  .btn{
    background-color: #eee
  }
  .red{
    text-align: center;
    color:red;
  }
  .icon{
    font-size: 50px;
    color:  #f44064;
    margin: 1rem 0;
  }
</style>
