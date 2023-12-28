<template>
  <div class="container">
    <div class="first">
      <div id="weekly-calendar">
        <span class="navigation-icon" @click="prevWeek">◀</span>
        <div>{{ startdate }} to {{ enddate }}</div>
        <span class="navigation-icon" @click="nextWeek">▶</span>
      </div>
      <h1>{{ userId }}</h1>
    </div>

    <div class="options" v-if="routeName != '/manager/team'">
      <button
        :class="{ checkin: true, checked: checked }"
        @click="startCountdown"
      >
        <button :class="{ timebtn: true }" @click="toggleText">
          <i class="bx bx-time"></i>{{ buttonText }}
        </button>
        <!-- <div>{{ currentTime }}</div> -->
      </button>

      <v-btn class="nudge ma-2" @click.stop="dialog = true">Make request</v-btn>

      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <div class="reqLoader" v-if="requestLoader">
            <v-progress-circular
              indeterminate
              color="primary"
              class="loader"
            ></v-progress-circular>
            <p class="req">Sending Request</p>
          </div>
          <div v-else>
            <div v-if="success" class="success">
              <i @click="dialog = false" class="bx bx-window-close close"></i>
              <i class="bx bxs-message-square-check"></i>
              <p class="sentMsg">Request Sent</p>
            </div>
            <div v-else-if="errorSendingReq">
              <i @click="dialog = false" class="bx bx-window-close close"></i>
              <p class="errorReq">Error Sending</p>
            </div>
          </div>
          <div
            class="content"
            v-if="
              requestLoader === false &&
              success === false &&
              errorSendingReq === false
            "
          >
            <v-card-title class="text-h5 dialogMakeReq"> Send Request </v-card-title>
            <div class="excuses">
              <v-radio-group v-model="radios" class="radioBtns">
                <v-radio label="Leave" value="Leave"></v-radio>
                <v-radio label="WFH" value="WFH"></v-radio>
              </v-radio-group>
            </div>

            <p v-if="restrictDate" class="dateRestrict">
              Already Leave
            </p>

            <div class="date">
              <div class="dates">
                <label>From</label>
                <input
                  required
                  type="date"
                  v-model="selectedFromDate"
                  :min="minDate"
                 
                />
              </div>
              <div class="dates">
                <label for="">To</label>
                <input
                  type="date"
                  v-model="selectedToDate"
                  placeholder="To Date"
                  :min="minDate"
                  
                />
              </div>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="green-darken-1"
                variant="text"
                @click="dialog = false"
              >
                Close
              </v-btn>

              <v-btn color="green-darken-1" variant="text" @click="sendRequest">
                Send
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
    </div>

    <v-progress-circular
      indeterminate
      color="primary"
      v-if="loader"
      class="loader"
    ></v-progress-circular>
    <v-container v-else class="table">
      <v-row no-gutters class="tr">
        <v-col lg="2" sm="1" md="1">
          <v-sheet class="th"> </v-sheet>
        </v-col>
        <v-col lg="1">
          <v-sheet class="center th"> Check in </v-sheet>
        </v-col>
        <v-col class="progress" lg="6">
          <v-sheet class="center pa-2 ma-2 th"> Progress </v-sheet>
        </v-col>
        <v-col lg="1">
          <v-sheet class="center th"> Check out</v-sheet>
        </v-col>
        <v-col lg="2" sm="1" md="1">
          <v-sheet class="center th"> Total HRS </v-sheet>
        </v-col>
      </v-row>
      <v-row class="tr" v-for="(day, index) in weekHistory" :key="index">
        <v-col lg="2" sm="1" md="1">
          <v-sheet
            :class="{
              'pa-2': true,
              'ma-2': true,
              td: true,
              center: true,
              day: true,
              active: isToday(day),
            }"

          >
            {{ day.day }}
          </v-sheet>
        </v-col>
        <v-col lg="1">
          <v-sheet class="center flex td" v-if="isToday(day)">
            {{ startTime }}</v-sheet
          >
          <v-sheet v-else class="center flex td"> {{ day.checkIn }} </v-sheet>
        </v-col>
        <v-col lg="6" sm="0" class="progress">
          <v-sheet class="center td">
            <span v-if="isToday(day)">
              <v-progress-linear
                :model-value="progressValue"
                height="16"
                striped
                rounded
                color="lime"
                class="progress-bar"
              >
                <div
                  class="dot"
                  :style="{
                    position: 'absolute',
                    display:'none',
                    zIndex: '1',
                    background: 'purple',
                    width: '2px',
                    height: '10px',
                    left: currentDotPosition,
                  }"
                ></div>
              </v-progress-linear>
            </span>
            <v-progress-linear
              v-else-if="day.actionType === 'leave'"
              model-value="0"
              height="16"
              striped
              rounded
              color="grey"
            >
              Leave</v-progress-linear
            >
            <v-progress-linear
              v-else-if="day.actionType === 'wfh'"
              model-value="100"
              height="16"
              striped
              rounded
              color="grey"
            >
              WFH</v-progress-linear
            >
            <v-progress-linear
              v-else
              model-value="0"
              height="10"
              striped
              rounded
              color="grey"
            ></v-progress-linear>
          </v-sheet>
        </v-col>
        <v-col lg="1">
          <v-sheet class="flex td" v-if="isToday(day)">
            {{ endTime }}
          </v-sheet>
          <v-sheet v-else class="center flex td"> {{ day.checkOut }} </v-sheet>
        </v-col>
        <v-col lg="2" sm="1" md="1">
          <v-sheet class="flex td" v-if="isToday(day)">
            {{ totalTime }}
          </v-sheet>
          <v-sheet v-else class="flex td">{{ day.workingHours }}</v-sheet>
        </v-col>
      </v-row>
    </v-container>

    <h1 class="error" v-if="isError">Unable to Fetch Data</h1>
  </div>
</template>
<script src="./js/employeeDashboard"></script>
<style scoped>
.dates {
  padding: 10px 5px;
}
.sentMsg{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.bx-window-close{

}
.options {
  display: flex;
  align-items: center;
  margin-left: 10rem;
  margin-top:2rem ;
  margin-bottom: 2rem;
}
.nudge {
  padding: 10px 15px;
  margin: 1rem 1rem;
  background: #388e3c;
  color: white;
}
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.first {
  margin: 0 auto;
  background-color: #f4f6fb;
  width: 100%;
  height: 10vh;
  display: flex;
  align-items: center;
}
#weekly-calendar {
  text-align: center;
  margin: 0 auto;
  display: flex;
}
.navigation-icon {
  cursor: pointer;
  margin: 0 10px;
}
.radioBtns{
  display: flex;
  justify-content: center;
  align-items: center;
}
.checkin {
  width: 150px;
  margin-left: 10px;
  height: 37px;

  color: white;
  background: #388e3c;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.timebtn {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 0;
}
.timebtn i {
  font-size: 30px;
  margin-right: 8px;
}
.checked {
  background-color: rgba(255, 99, 71, 1);
}
.table {
  width: 100%;
  margin: 0 auto;
}
.row {
  border-bottom: 2px solid black;
}
.table {
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
.tr {
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}
.th {
  text-transform: uppercase;
  font-weight: 900;
  font-size: 15px;
}
.td {
  padding: 1rem 2rem;
}

.active {
  font-weight: bold;
}
.inputMsg {
  width: 80%;
  margin: 0 auto;
}
.date {
  display: flex;
}
.v-overlay__content {
  width: 1000px;
}
.text-h5 {
  background: #e1e5ee;
  color: #333;
  text-align: center;
}
.loader {
  position: absolute;
  top: 40%;
  left: 48%;
  bottom:10%;
}
.reqLoader {
  margin: 1rem;
}
.error {
  position: absolute;
  top: 40%;
  left: 30%;
  color: red;
}
.req {
  margin-top: 7rem;
  margin-left: 4.7rem;
  color: #f44064;
}
.success {
  color: #388e3c;
  text-align: center;
}
.close {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 15px;
}
.bxs-message-square-check{
  margin-top: 1rem;
}
.errorReq {
  color: red;
}
.center {
  text-align: center;
}
.dateRestrict {
  color: red;
  text-align: center;
}
.flex {
  display: flex;
  justify-content: center;
}
.progress-bar {
  position: relative;
}
.dialogMakeReq{
  background: #f44064;
  color: #fff;
}
.dates{

  text-align: center;
}
input[type="date"]{
  border: 1px solid black;
 
}
input[type="date"]:focus{
outline: none;
 
}


/**mobile */
@media (max-width: 767px) {
  .progress {
    display: none;
  }
  .v-col {
    width: 10px;
    padding: 0;
  }
  .th,
  .td {
    font-size: 12px;
  }
  .options {
    display: flex;
    justify-content: center;
    margin-left: 0;
  }
  .day {
    font-size: 10.5px;
  }
}
/**tablet */
@media (min-width: 768px) and (max-width: 991px) {
  .progress {
    display: none;
  }
}
</style>
