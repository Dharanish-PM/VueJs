<template>
  <div class="main">
    <ul class="box-info">
      <li>
        <v-progress-circular
          :model-value="progressvalue"
          :size="128"
          :width="12"
          color="teal"
        >
          <template v-slot:default> {{ progressvalue }} % </template>
        </v-progress-circular>
        <div class="desc">
          <p><span class="present">{{ this.todayTeamDetails.presentCount }}</span>/{{ this.todayTeamDetails.totalCount }}</p>
          <p>Present</p>
        </div>
      </li>
      <li>
        <i class="bx bx-laptop"></i>
        <div class="desc">
          <p><span class="present">{{ this.todayTeamDetails.wfhCount }}</span>/{{ this.todayTeamDetails.totalCount }}</p>
          <p>WFH</p>
        </div>
      </li>
      <li>
        <i class="bx bx-home-heart"></i>
        <div class="desc">
          <p><span class="present">{{ this.todayTeamDetails.leaveCount }}</span>/{{ this.todayTeamDetails.totalCount }}</p>
          <p>Leave</p>
        </div>
      </li>
    </ul>

    <div class="table-data">
      <div class="order">
        <div class="head">
          <h3>Pending Requests</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Action Type</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Take Your Action</th>
            </tr>
          </thead>

          <v-progress-circular
            indeterminate
            color="primary"
            v-if="allrequestsLoader"
            class="loader"
          ></v-progress-circular>
          <p v-else-if="isErrorGettingAllRequest" class="error">
            Unable to Fetch
          </p>
          <tbody v-else>
            <tr  v-for="(request, index) in  allSubordinateRequests" :key="index">
              <td>{{ request.employeeName }}</td>
              <td>{{ request.actionType }}</td>
              <td>{{ request.actionStarted }}</td>
              <td>{{ request.actionEnded }}</td>
              <td>
                <p :class="getClassName(request)">{{ request.status }}</p>
              </td>
              <td class="response">
                <button
                  v-if="request.status === 'pending'"
                  @click="takeActionAllow(request)"
                  class="allow"
                >
                  Allow
                </button>
                <button
                  v-if="request.status === 'pending'"
                  @click="takeActionDeny(request)"
                  class="deny"
                >
                  Deny
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="todo">
        <div class="head">
          <h3>Subordinates</h3>
          <div>
            <!--Search-->
          </div>
        </div>
        <v-progress-circular
          indeterminate
          color="primary"
          v-if="allSubordinatesLoader"
          class="subordinateloader"
        ></v-progress-circular>
        <p v-else-if="isErrorGettingAllSubordinates" class="error">
          Unabl to Fetch
        </p>
        <div v-else class="userlist">
          <div class="user-content">
            <div class="description">
              <v-expansion-panels class="panel">
                <v-expansion-panel v-for="(user, index) in allSubordinates" :key="index">
                  <v-expansion-panel-title disable-icon-rotate>
                    <img
                      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                      alt=""
                      class="user-img"
                    />

                    {{ user.employeeName }}
                    <template v-slot:actions>
                      <!-- <v-icon color="error" icon="mdi-alert-circle"> </v-icon> -->
                    </template>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    "The Action to be taken"

                    <div class="User-Buttons">
                      <div class="report">
                        <v-row justify="center">
                          <v-dialog
                            v-model="reportDialog"
                            fullscreen
                            :scrim="false"
                            transition="dialog-bottom-transition"
                          >
                         
                            <template v-slot:activator="{ props }">
                              <v-btn class="reportBtn" elevation="2" @click="getWeekHistories(user.id)" rounded v-bind="props"
                                >Report </v-btn
                              >
                            </template>
                            <v-card>
                              <v-toolbar dark color="primary">
                                <v-btn icon dark @click="reportDialog = false">
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <v-toolbar-title>Report</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-toolbar-items>
                                  <!-- <v-btn variant="text" @click="reportDialog = false">
                                    Save
                                  </v-btn> -->
                                </v-toolbar-items>
                              </v-toolbar>

                              <!--Weekly-->
                              <h1 class="overlay-heading headW">Weekly Report</h1>
                              <EmployeeDashboard :userId="user.id" ></EmployeeDashboard>

                              <v-divider></v-divider>

                              <!--Monthly-->
                              <h1 class="overlay-heading headW">Monthly Report</h1>
                              <Calender
                                class="monthlyReport"
                                :userId="user.id"
                              ></Calender>
                            </v-card>
                          </v-dialog>
                        </v-row>
                      </div>

                      <div class="nudge-btn">
                        <v-row justify="center">
                          <v-btn
                            elevation="2"
                            class="nudge reportBtn"
                            rounded
                            @click.stop="dialog = true"
                            >Nudge</v-btn
                          >

                          <v-dialog v-model="dialog" max-width="290">
                            <v-card>
                              <div v-if="nudgeLoader">
                                <v-progress-circular
                                  indeterminate
                                  color="primary"
                                  class="nudgeloader"
                                ></v-progress-circular>
                              </div>

                              <div v-else>
                                <div v-if="nudgeMsgSent" class="success">
                                  <i
                                    @click="dialog = false"
                                    class="bx bx-window-close close"
                                  ></i>
                                  <i class="bx bxs-message-square-check"></i>
                                  <p>Message Sent</p>
                                </div>
                                <div v-else-if="errorSendingReq">
                                  <i
                                    @click="dialog = false"
                                    class="bx bx-window-close close"
                                  ></i>
                                  <p class="errorReq">Error Sending</p>
                                </div>
                              </div>

                              <div v-if="nudgeLoader===false && nudgeMsgSent===false && errorSendingNudge===false">
                                <v-card-title class="text-h5">
                                  Send Message
                                </v-card-title>

                                <v-textarea
                                  clearable
                                  clear-icon="mdi-close-circle"
                                  label="Text"
                                  v-model="nudgeMsg"
                                  class="inputMsg"
                                ></v-textarea>

                                <v-card-actions>
                                  <v-spacer></v-spacer>

                                  <v-btn
                                    color="green-darken-1"
                                    variant="text"
                                    
                                  >
                                    Close
                                  </v-btn>
                                  <v-btn
                                    color="green-darken-1"
                                    variant="text"
                                    @click="sendNudge(user.id)"
                                  >
                                    Send
                                  </v-btn>
                                </v-card-actions>
                              </div>
                            </v-card>
                          </v-dialog>
                        </v-row>
                      </div>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./js/managerDashboard"></script>
<style scoped>
.main {
  width: 80%;
  margin: 0 auto;
}
.down {
  font-size: 25px;
  margin-left: 10px;
}

.box-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  grid-gap: 24px;
  width: 80%;
  margin: 1rem auto;
  margin-top: 5rem;
}
.box-info li {
  padding: 10px;
  background: white;
  box-shadow: 2px 1px 5px #e1e5ee;
  border-left: 10px solid teal;
  border-radius: 20px;
  display: flex;
  align-items: center;
  grid-gap: 10px;
  justify-content: space-around;
}
.box-info li i {
  font-size: 80px;
  border-radius: 10px;
}
.bx-home-heart {
  font-size: 40px;
}

.table-data {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  grid-gap: 24px;
  margin-top: 24px;
  width: 100%;
  margin-top: 1rem;
}
.table-data > div {
  padding: 24px;
}
.table-data .order {
  flex-grow: 1;
  flex-basis: 500px;
}
.table-data .head {
  display: flex;
  align-items: center;
  grid-gap: 16px;
  margin-bottom: 1rem;
}

.table-data .order table {
  width: 100%;
}
.table-data .todo {
  flex-grow: 1;
  flex-basis: 450px;
}
.response {
  display: flex;
  justify-content: space-between;
}

table {
  border-collapse: collapse;
  box-shadow: 0 5px 10px #e1e5ee;
  background-color: white;
  text-align: left;
  overflow: hidden;
  border-radius: 15px;
}
thead {
  box-shadow: 0 5px 10px #e1e5ee;
}
th {
  padding: 1rem 2rem;
  text-transform: uppercase;
  font-weight: 900;
  font-size: 13px;
}
td {
  padding: 1rem 2rem;
  text-transform: capitalize;
}
.status-decline {
  border-radius: 10px;
  background-color: #ffcdd2;
  color: #c62828;
  padding: 0.2rem 1rem;
  text-align: center;
}
.status-pending {
  border-radius: 10px;
  background-color: #fff0c2;
  color: #a68b00;
  padding: 0.2rem 1rem;
  text-align: center;
}
.status-approved {
  border-radius: 10px;
  background-color: #c8e6c9;
  color: #388e3c;
  padding: 0.2rem 1rem;
  text-align: center;
}
tr:nth-child(even) {
  background-color: #f4f6fb;
}
.allow:hover {
  transform: scale(0.9);
}
.allow {
  border-radius: 10px;
  background-color: #c8e6c9;
  color: #388e3c;
  padding: 0.2rem 1rem;
  text-align: center;
  margin-top: 9px;
}
.deny {
  border-radius: 10px;
  background-color: #ffcdd2;
  color: #c62828;
  padding: 0.2rem 1rem;
  text-align: center;
  margin-left: 10px;
  margin-top: 9px;
}
.deny:hover {
  transform: scale(0.9);
}

.users {
  margin: 0;
}
.panel {
  width: 74%;
}

.user-img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  border: 1px solid #eee;
  margin-right: 10px;
}

.nudge {
  margin-left: 1rem;
}
.btns {
  margin: 5%;
}
.inputMsg {
  margin: 5%;
}
.User-Buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.monthlyReport {
  margin: 1rem auto;
}
.overlay-heading {
  margin-top: 1rem;
}
.present {
  font-size: 40px;
  color: teal;
}
.headW{
  text-align: center;
  color:black;


}
h3 {
  box-shadow: 2px 1px 5px #e1e5ee;
  border-left: 10px solid teal;
  padding: 10px;
  border-radius: 20px;
}
.loader {
  margin: 2rem 0;
  position: relative;
  left: 20rem;
}
.error {
  color: red;
  text-align: center;
  margin: 1rem;
  width: 100%;
}

.subordinateloader {
  margin-left: 10rem;
}
.nudgeloader {
  position: relative;
  left: 8rem;
}
.success {
  color: #388e3c;
  text-align: center;
}

.close {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 20px;
  color: #a68b00;
}
.errorReq{
  color:red;
  
}
.reportBtn{
    margin: 1rem;
  
}

@media screen and (max-width: 768px) {
  
  .order{
    overflow-x: scroll;
  }

    .reportBtn{
        width: 30px;
        font-size: 12px;
  
}

   

  
}

</style>
