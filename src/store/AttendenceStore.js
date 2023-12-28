import { defineStore } from "pinia";
import Service from "../services/service";
export const AttendenceStore = defineStore("AttendenceStore ", {
  state: () => ({
    employeeId: null,
    role: null,
    allEmployeeRequest:[],
    weekHistory:[],
    allSubordinateRequests:[],
    allSubordinates:[],
    allNotifications:[],
    calenderEvents:[],
    holidays:[],
    originalHolidays:[],
    monthHistory:[],
    todayTeamDetails:[]
  }),
  actions: {
    async getLoginInfo({ success, failure, payload }) {
      try {
        const response = await Service.post(payload,"/login");
        if (response.status === 404) {
          failure && failure();
          throw new Error("Page not found");
        } else if (response.status === 500) {
          failure && failure();
          throw new Error("Server error");
        } else if (!response.ok) {
          failure && failure();
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        if (data.message === "Success") {
          localStorage.setItem("empId", data.id);
          localStorage.setItem("role", data.role);
          this.employeeId = data.id;
          this.role = data.role;
          success && success(this.role);
        } else {
          failure && failure();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async swipe({ success, failure, payload }) {
      setTimeout(()=>{
        success & success();
      },2000);
      
      try {
        console.log(payload);
        const response = await Service.post(payload,"/swipecard");
        if (response.status === 404) {
          failure && failure();
          throw new Error("Page not found");
        } else if (response.status === 500) {
          failure && failure();
          throw new Error("Server error");
        } else if (!response.ok) {
          failure && failure();
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        success && success();
      } catch (error) {
        console.error(error);
      }
    },

    async makeRequest({ success, failure, payload }){
      try {
        console.log(payload);
        const response = await Service.post(payload,"/applyactions/"+localStorage.getItem("empId"));
        if (response.status === 404) {
          failure && failure();
          throw new Error("Page not found");
        } else if (response.status === 500) {
          failure && failure();
          throw new Error("Server error");
        } else if (!response.ok) {
          failure && failure();
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        this.weekHistory=[...this.weekHistory]
        success && success(this.role);
      } catch (error) {
        console.error(error);
      }

    },

    async getAllRequestMade({ success, failure }){
      try {
        const response = await Service.get("/viewactionhistory/"+localStorage.getItem("empId"));
        if (response.status === 404) {
          failure && failure();
          throw new Error("Page not found");
        } else if (response.status === 500) {
          failure && failure();
          throw new Error("Server error");
        } else if (!response.ok) {
          failure && failure();
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
  
        data.sort((a, b) => {
          if (a.status === 'pending') return -1;
          if (b.status === 'pending') return 1;
          return 0;
        });
        this.allEmployeeRequest=[...data];
        success && success(this.role);
      } catch (error) {
        console.error(error);
      }

    },

    async getWeekHistory({success,failure,payload}){
      try {
        const response = await Service.post(payload,"/report");
        if (response.status === 404) {
          failure && failure();
          throw new Error("Page not found");
        } else if (response.status === 500) {
          failure && failure();
          throw new Error("Server error");
        } else if (!response.ok) {
          failure && failure();
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.weekHistory=[...data];
        console.log(this.weekHistory);
        success && success(this.role);
      } catch (error) {
        console.error(error);
      }
    },
    //manager
  async getSubordinatesRequests({success,failure}){

    try {
      const response = await Service.get("/viewpendingstatus/"+localStorage.getItem("empId"));
      if (response.status === 404) {
        failure && failure();
        throw new Error("Page not found");
      } else if (response.status === 500) {
        failure && failure();
        throw new Error("Server error");
      } else if (!response.ok) {
        failure && failure();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.allSubordinateRequests=[...data];
    
      success && success(this.role);
    } catch (error) {
      console.error(error);
    }

  },

  async updateStatus({success,failure,payload}){
    try {
      const response = await Service.puTT(payload,"/approval");
      if (response.status === 404) {
        failure && failure();
        throw new Error("Page not found");
      } else if (response.status === 500) {
        failure && failure();
        throw new Error("Server error");
      } else if (!response.ok) {
        failure && failure();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      success && success(payload.empId);
    } catch (error) {
      console.error(error);
    }
  },

  async getAllSubordinates({success,failure}){
    try {
      const response = await Service.get("/manager/"+localStorage.getItem("empId"));
      if (response.status === 404) {
        failure && failure();
        throw new Error("Page not found");
      } else if (response.status === 500) {
        failure && failure();
        throw new Error("Server error");
      } else if (!response.ok) {
        failure && failure();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.allSubordinates=[...data];
      success && success(this.role);
    } catch (error) {
      console.error(error);
    }
  },

  async getNotifications({success,failure}){

    try {
      console.log("inside");
      const response = await Service.get("/getUnreadNotification/"+localStorage.getItem("empId"));
      if (response.status === 404) {
        failure && failure();
        throw new Error("Page not found");
      } else if (response.status === 500) {
        failure && failure();
        throw new Error("Server error");
      } else if (!response.ok) {
        failure && failure();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.allNotifications=[...data];
      success && success();
    } catch (error) {
      console.error(error);
    }

  },

  async updateNotification(notificationId){
    try {
      notificationId=notificationId.toString();
      const response = await Service.put("/updateNotification/"+notificationId);
      if (response.status === 404) {
        failure && failure();
        throw new Error("Page not found");
      } else if (response.status === 500) {
        failure && failure();
        throw new Error("Server error");
      } else if (!response.ok) {
        failure && failure();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  },

  async nudgeEmployee({success,failure,payload}){
    try {
      console.log(payload);
      const response = await Service.post(payload,"/nudge");
      if (response.status === 404) {
        failure && failure();
        throw new Error("Page not found");
      } else if (response.status === 500) {
        failure && failure();
        throw new Error("Server error");
      } else if (!response.ok) {
        failure && failure();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      success && success()
    } catch (error) {
      console.error(error);
    }
  },

  async getCalenderEvents({success,failure,payload}){
    try {
      console.log(payload);
      const response = await Service.post(payload,"/calender");
      if (response.status === 404) {
        failure && failure();
        throw new Error("Page not found");
      } else if (response.status === 500) {
        failure && failure();
        throw new Error("Server error");
      } else if (!response.ok) {
        failure && failure();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      success && success()
    } catch (error) {
      console.error(error);
    }
  },

  async getAllHolidays(){
    try {
   
      const response = await Service.get("/holidays");
      if (response.status === 404) {
        // failure && failure();
        throw new Error("Page not found");
      } else if (response.status === 500) {
        // failure && failure();
        throw new Error("Server error");
      } else if (!response.ok) {
        // failure && failure();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.originalHolidays=[...data]
      this.holidays=[...data]
       this.mapAllHolidays();
      console.log(this.holidays);
      // success && success()
    } catch (error) {
      console.error(error);
    }
  },
  mapAllHolidays(){
    this.holidays= this.holidays.map(holiday => {
      const originalDate = new Date(holiday.holidayDate);
      const newDate = new Date(originalDate);
      newDate.setDate(originalDate.getDate() - 1);
      return {
        holidayDate: newDate.toISOString().split('T')[0],
        holidayType: holiday.holidayType,
      };
    });
  },

  async getMonthHistory({success,failure,payload}){
    try {
      console.log(payload);
      const response = await Service.post(payload,"/report");
      if (response.status === 404) {
        failure && failure();
        throw new Error("Page not found");
      } else if (response.status === 500) {
        failure && failure();
        throw new Error("Server error");
      } else if (!response.ok) {
        failure && failure();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.transform(data);
      success && success();
    } catch (error) {
      console.error(error);
    }

  },
  //mapping repsonse accroding to full calender 
  transform(data){
   this.monthHistory = data.map(item => {
      const title = item.checkIn ? "Present" : this.getTitleFromCheckAction(item.actionType);
      const description = this.getDescriptionFromCheckAction(item.actionType);
      const start = item.reportDate;
      const end = item.reportDate;
      return {
        title,
        description,
        start,
        end,
        rendering: "background",
        color: "#ff9f89"
      };
    });

  },

  
  getTitleFromCheckAction(checkAction) {

    if (checkAction === "leave") {
      return "Leave";
    } else if (checkAction === "wfh") {
      return "Wfh";
    } else {
      return "Unknown";
    }
  },

  getDescriptionFromCheckAction(checkAction) {

    if (checkAction === "LEAVE") {
      return "Leave";
    } else if (checkAction === "SICK") {
      return "Sick";
    } else {
      return "Unknown";
    }
  },

  async getTeamDetail({success,failure}){
    try {

      const response = await Service.get("/count/"+localStorage.getItem("empId"));
      if (response.status === 404) {
        failure && failure();
        throw new Error("Page not found");
      } else if (response.status === 500) {
        failure && failure();
        throw new Error("Server error");
      } else if (!response.ok) {
        failure && failure();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.todayTeamDetails=data
      console.log(this.todayTeamDetails);
      //presentCount
      //leaveCount
      //wfhCount
      //totalCount
      
      success && success();
    } catch (error) {
      console.error(error);
    }

  },
 

  },
});
