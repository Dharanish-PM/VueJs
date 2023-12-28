import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { mapActions, mapState } from "pinia";
import { AttendenceStore } from "../../store/AttendenceStore";

export default {
  data() {
    return {
      month: "December 2024",
      currentEmployeeEvent: [
        {
          title: "Leave",
          description: "Sick",
          start: "2023-12-06",
          end: "2023-12-06",
          rendering: "background",
          color: "#ff9f89",
        },
        {
          title: "WFH",
          start: "2023-12-07",
          end: "2023-12-07",
          rendering: "background",
          color: "#ff9f89",
        },
      ],
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
        headerToolbar: {
          left: "title",
          // left:'dayGridMonth',
          right: "prev today next",
        },
        weekends: "true",
        selectable: "false",
        editable: "false",
        events: [],
        dayCellDidMount: this.dayCellDidMountCallback,
        datesSet: this.getMonthHistories,
       
      },
    };
  },
  computed: {
    ...mapState(AttendenceStore, ["calenderEvents", "holidays","monthHistory"]),
  },

  methods: {
    ...mapActions(AttendenceStore, ["getCalenderEvents", "getAllHolidays","getMonthHistory"]),
    calculateMonth() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.toLocaleString("en-US", { month: "long" });
      this.month = `${month} ${year} `;
    },
    dayCellDidMountCallback(info) {
      // const isWeekend = info.date.getDay() === 0 || info.date.getDay() === 6;

      // // Color weekends
      // if (isWeekend) {
      //   info.el.style.backgroundColor = "#aabbcc";
      // }
      const cellDate = info.date.toISOString().split("T")[0];
      if (this.isDateInHolidays(cellDate)) {
        info.el.style.backgroundColor = "rgba(0,0,0,0.1)";
      }
  
      const year = info.date.getFullYear();
      const month = info.date.toLocaleString("en-US", { month: "long" });
       var sendMonth= `${month} ${year}`;
      // this.getMonthHistories(sendMonth)
      
    },

    isDateInHolidays(dateToCheck) {
      return this.holidays.some(
        (holiday) => holiday.holidayDate === dateToCheck
      );
    },

    onSuccess() {
      console.log("sdf");
      this.setMonthEvents();
    },
    onFailure() {
      console.log("sdcd");
    },
    getMonthHistories(info) {
      const monthName=info.view.title;
      const effectiveUserId = this.userId !== undefined ? this.userId : localStorage.getItem("empId");
      console.log(effectiveUserId);
      const requestBody = {
        payload: {
          emplId:effectiveUserId,
          month:monthName
        },
        success: this.onSuccess,
        failure: this.onFailure,
      };
      this.getMonthHistory(requestBody);
    },
    setMonthEvents(){
      this.calendarOptions.events =this.monthHistory;
    }
  },
  props:['userId'],
  components: {
    FullCalendar,
  },
 
 
  mounted() {
    this.getAllHolidays();
    this.calculateMonth();

  },
};
