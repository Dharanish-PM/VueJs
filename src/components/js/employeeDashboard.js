import { mapActions, mapState } from "pinia";
import { AttendenceStore } from "../../store/AttendenceStore";

export default {
  data() {
    return {
      dialog: false,
      currentDate: new Date(),
      currentDayName: "",
      currentMonth: "",
      currentYear: "",
      buttonText: "Check-in",
      checked: false,
      currentTime: "",
      weekDays: [],
      startTime: "-",
      endTime: "-",
      totalTime: "--",
      startdate: "",
      enddate: "",
      dialog2 :false,
      reportDialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      routeName: null,
      progressValue: 0,
      radios: null,
      selectedFromDate: null,
      selectedToDate: null,
      loader: false,
      isError: false,
      requestLoader: false,
      success: false,
      errorSendingReq: false,
      restrictDate: false,
      dotPosition: null,
      currentDotPosition: 0,
      selectedEditDate:"",
      editTime:"",

      customeWeek: [
        {
          reportId: 0,
          emplId: 3,
          reportDate: "2023-12-24",
          checkIn: "10:33:04",
          checkOut: "18:33:04",
          workingHours: 8,
          day: "SUNDAY",
        },
        {
          reportId: 0,
          emplId: 3,
          reportDate: "2023-12-25",
          checkIn: "09:33:04",
          checkOut: "21:33:04",
          workingHours: 12,
          day: "MONDAY",
        },
        {
          reportId: 0,
          emplId: 3,
          reportDate: "2023-12-26",
          workingHours: 0,
          actionType: "leave",
          day: "TUESDAY",
        },
        {
          reportId: 0,
          emplId: 3,
          reportDate: "2023-12-27",
          checkIn: "06:46:36",
          checkOut: "13:58:24",
          workingHours: 7,
          day: "WEDNESDAY",
        },
      ],
    };
  },
  watch: {
    selectedFromDate(newData) {
      const selectedDate = new Date(newData);
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const day = selectedDate.getDate().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      if (
        selectedDate.getDay() === 0 ||
        selectedDate.getDay() === 6 ||
        this.isDateInHolidays(formattedDate)
      ) {
        selectedDate.setDate(
          selectedDate.getDate() + (selectedDate.getDay() === 0 ? 1 : 2)
        );
        const newformattedDate = selectedDate.toISOString().split("T")[0];
        this.selectedFromDate = newformattedDate;
        this.restrictDate = true;
        setTimeout(() => {
          this.restrictDate = false;
        }, 2000);
      }
    },

    selectedToDate(newData) {
      const selectedtoDate = new Date(this.selectedToDate);
      const year = selectedtoDate.getFullYear();
      const month = (selectedtoDate.getMonth() + 1).toString().padStart(2, "0");
      const day = selectedtoDate.getDate().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      if (
        selectedtoDate.getDay() === 0 ||
        selectedtoDate.getDay() === 6 ||
        this.isDateInHolidays(formattedDate)
      ) {
        selectedtoDate.setDate(
          selectedtoDate.getDate() + (selectedtoDate.getDay() === 0 ? 1 : 2)
        );
        const newformattedDate = selectedtoDate.toISOString().split("T")[0];
        this.selectedFromDate = newformattedDate;
        this.restrictDate = true;
        setTimeout(() => {
          this.restrictDate = false;
        }, 2000);
      }
    },
  },
  computed: {
    ...mapState(AttendenceStore, ["originalHolidays", "weekHistory"]),
    minDate() {
      const date = new Date();
      var tdate = date.getDate();
      var month = date.getMonth() + 1;
      if (tdate < 10) {
        tdate = "0" + tdate;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var yr = date.getUTCFullYear();

      var effectiveMinDate = yr + "-" + month + "-" + tdate;
      return effectiveMinDate;
    },
  },

  methods: {
    ...mapActions(AttendenceStore, [
      "swipe",
      "makeRequest",
      "getWeekHistory",
      "getAllHolidays",
    ]),

    isDateInHolidays(dateToCheck) {
      return this.originalHolidays.some(
        (holiday) => holiday.holidayDate === dateToCheck
      );
    },

    prevWeek() {
      this.currentDate.setDate(this.currentDate.getDate() - 7); // Move back by 7 days
      this.startDate();
      this.endDate();
      this.getWeekHistories();
    },
    nextWeek() {
      this.currentDate.setDate(this.currentDate.getDate() + 7); // Move back by 7 days
      this.startDate();
      this.endDate();
      this.getWeekHistories();
    },
    startDate() {
      const startOfWeek = new Date(this.currentDate);
      startOfWeek.setDate(
        this.currentDate.getDate() - this.currentDate.getDay()
      );
      let year = startOfWeek.getFullYear();
      let month = (startOfWeek.getMonth() + 1).toString().padStart(2, "0");
      let day = startOfWeek.getDate().toString().padStart(2, "0");
      this.startdate = `${year}-${month}-${day}`;
    },
    endDate() {
      const endOfWeek = new Date(this.currentDate);
      endOfWeek.setDate(
        this.currentDate.getDate() - this.currentDate.getDay() + 6
      );
      let year = endOfWeek.getFullYear();
      let month = (endOfWeek.getMonth() + 1).toString().padStart(2, "0");
      let day = endOfWeek.getDate().toString().padStart(2, "0");

      this.enddate = `${year}-${month}-${day}`;
    },

    toggleText() {
      const now = new Date();
      const hours = this.padZero(now.getHours());
      const minutes = this.padZero(now.getMinutes());
      const seconds = this.padZero(now.getSeconds());
      if (this.buttonText === "Check-in" && this.startTime == "-") {
        this.startTime = `${hours}:${minutes}:${seconds}`;
      }
      if (this.buttonText === "Check-out") {
        this.endTime = `${hours}:${minutes}:${seconds}`;
      }

      this.buttonText =
        this.buttonText === "Check-in" ? "Check-out" : "Check-in";
      this.checked = !this.checked;
    },
    updateTime() {
      const now = new Date();
      const hours = this.padZero(now.getHours());
      const minutes = this.padZero(now.getMinutes());
      const seconds = this.padZero(now.getSeconds());
      this.currentTime = `${hours}:${minutes}:${seconds}`;
    },
    padZero(value) {
      return value < 10 ? "0" + value : value;
    },
    generateWeekStartingFromMonday() {
      const date = new Date();
      const today = date.getDay();

      const daysOfWeek = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ];

      this.currentDayName = daysOfWeek[today];
    },

    startCountdown() {
      this.loader = true;
      this.updateTime();
      setInterval(() => {
        this.updateTime();
      }, 1000);
      this.updateProgress();
      setInterval(this.updateProgress, 1000);

      const requestBody = {
        payload: {
          employeeId: localStorage.getItem("empId"),
        },
        success: this.onSuccess,
        failure: this.onFailure,
      };

      this.swipe(requestBody);
      this.setPosition();
      this.getWeekHistories();
    },
    updateProgress() {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const seconds = currentTime.getSeconds();

      // Calculate progress based on time
      const totalSecondsInDay = 24 * 60 * 60;
      const currentSeconds = hours * 3600 + minutes * 60 + seconds;
      this.progressValue = (currentSeconds / totalSecondsInDay) * 100;

      const progressElement = this.$el.querySelector(
        ".v-progress-linear__determinate.bg-lime"
      );
      if (progressElement) {
        this.dotPosition = progressElement.style.width;
      }
    },

    getDayOfWeek(dayIndex) {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return daysOfWeek[dayIndex];
    },
    onSuccess(role) {
      this.loader = false;
    },
    onFailure() {
      this.isError = true;
    },
    onrequestSuccess() {
      this.requestLoader = false;
      this.success = true;
      setTimeout(() => {
        this.success = false;
      }, 3000);
    },
    onrequestFailure() {
      this.success = false;
      this.requestLoader = false;
      this.errorSendingReq = true;
    },
    sendRequest() {
      this.errorSendingReq = false;
      this.success = false;
      this.requestLoader = true;

      const requestBody = {
        payload: {
          actionType: this.radios.toLowerCase(),
          actionStarted: this.selectedFromDate,
          actionEnded: this.selectedToDate,
        },
        success: this.onrequestSuccess,
        failure: this.onrequestFailure,
      };
      this.makeRequest(requestBody);
    },

    getWeekHistories() {
      console.log("hlo");
      const effectiveUserId =
        this.userId !== undefined ? this.userId : localStorage.getItem("empId");
      console.log(effectiveUserId);
      const requestBody = {
        payload: {
          emplId: effectiveUserId,
          startDate: this.startdate,
          endDate: this.enddate,
        },
        success: this.onSuccess,
        failure: this.onFailure,
      };

      this.getWeekHistory(requestBody);
    },
    roleSet() {
      this.routeName = this.$route.fullPath;
      console.log(this.routeName);
    },
    setPosition() {
      console.log(this.currentDotPosition);
      this.currentDotPosition = this.dotPosition;
    },
    isToday(day) {
      const cd = new Date();
      const monthMapping = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
      };
      const dayOptions = { day: "numeric" };
      const monthOptions = { month: "long" };
      const yearOptions = { year: "numeric" };
      var currentDay = cd.toLocaleDateString("en-US", dayOptions);
      var currentMonth = cd.toLocaleDateString("en-US", monthOptions);
      var currentYear = cd.toLocaleDateString("en-US", yearOptions);
      const formattedDate = `${currentYear}-${monthMapping[currentMonth]}-${currentDay}`;
      const dateArray = day.reportDate.split("-");

      const year = dateArray[0];
      const month = dateArray[1];
      const recvday = dateArray[2];
      const newformattedDate = `${year}-${month}-${recvday}`;
      if(formattedDate===newformattedDate){
        return true;
      }
      return false;
    },


    sendEditRequest(){
      this.errorSendingReq = false;
      this.success = false;
      this.requestLoader = true;
      console.log(this.editTime);

     

      const requestBody = {
        payload: {
          employeeId: localStorage.getItem("empId"),
          swipeDate: this.selectedEditDate,
          swipeTime: `${this.editTime}:00`
        },
        success: this.onrequestSuccess,
        failure: this.onrequestFailure,
      };
      this.swipe(requestBody);

    }
  },
  props: ["userId"],
  mounted() {
    this.generateWeekStartingFromMonday();
    this.startDate();
    this.endDate();
    this.getWeekHistories();
    this.roleSet();
    this.getAllHolidays();
  },
};
