import Calender from "@/components/Calender.vue";
import EmployeeDashboard from "@/components/EmployeeDashboard.vue";
import { mapActions, mapState, mapWritableState } from "pinia";
import { AttendenceStore } from "../../store/AttendenceStore";
export default {
  data() {
    return {
      dialog: false,
      reportDialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      searchItem: "",
      allrequestsLoader:true,
      isErrorGettingAllRequest:false,
      allSubordinatesLoader:true,
      isErrorGettingAllSubordinates:false,
      nudgeMsg:"",
      nudgeLoader:false,
      nudgeMsgSent:false,
      errorSendingNudge:false,
      progressvalue:"",

    };
  },
  computed: {
    ...mapWritableState(AttendenceStore, [
      "allSubordinateRequests",
      "allSubordinates",
      "weekHistory",
      "todayTeamDetails"

    ]),
  },
  methods: {
    ...mapActions(AttendenceStore, [
      "getSubordinatesRequests",
      "updateStatus",
      "getAllSubordinates",
      "nudgeEmployee","getWeekHistory","getTeamDetail"
    ]),
    getClassName(request) {
      return {
        "status-decline": request.status === "declined",
        "status-approved": request.status === "approved",
        "status-pending": request.status === "pending",
      };
    },

    approvalSuccess(approvedId){
    
      
        const idx = this.allSubordinateRequests.findIndex(
        (req) => req.empId === approvedId
      );
      console.log(idx);
      this.allSubordinateRequests[idx].status = "approved";
      // this.dummy[0].status="approved";
    },
    approvalFailure(){
        alert('Failed');
    },

    takeActionAllow(request) {
      console.log(request);
    

      const requestBody = {
        payload: {
          empId: request.empId,
          actionType: request.actionType,
          createdDate: request.createdDate,
          actionStarted: request.actionStarted,
          status: "approved",
        },
        success: this.approvalSuccess,
        failure: this.approvalFailure,
      };
      console.log(requestBody);

      this.updateStatus(requestBody);

    },

    denialSuccess(request){
      const idx = this.allSubordinateRequests.findIndex(
        (req) => req.employeeName === request.employeeName
      );
      this.allSubordinateRequests[idx].status = "declined";
      // this.dummy[0].status="denied";

    },
    denialFailure(){
      alert("Failed")
    },
    takeActionDeny(request) {
      
      const requestBody = {
        payload: {
          empId: request.empId,
          actionType: request.actionType,
          createdDate: request.createdDate,
          actionStarted: request.actionStarted,
          status: "denied",
        },
        success: this.denialSuccess,
        failure: this.denialFailure,
      };
      console.log(requestBody);
      this.updateStatus(requestBody);

    },
    ongettingAllRequestsSuccess() {
      this.allrequestsLoader=false;
      
    },
    ongettingAllRequestsFailure() {
      this.allrequestsLoader=false;
      this.isErrorGettingAllRequest=true;
    },
    ongettingAllSubordinatesSuccess() {
      this.allSubordinatesLoader=false;
      
    },
    ongettingAllRequestsFailure() {
      this.allSubordinatesLoader=false;
      this.isErrorGettingAllSubordinates=true;
    },
   
    nudgeMsgSuccess(){
      this.nudgeLoader=false;
      this.nudgeMsgSent=true;
    },
    nudgeMsgFailure(){
      this.nudgeMsgSent=false;
      this.nudgeLoader=false;
      this.errorSendingNudge=true;

    },

    sendNudge(userid){
      this.errorSendingNudge=false;
      this.nudgeLoader=true;
      this.nudgeMsgSent=false;
  
      const requestBody = {
        payload: {
          empId: userid,
          notificationMessage:this.nudgeMsg
        },
        success: this.nudgeMsgSuccess,
        failure: this.nudgeMsgFailure,
      };

      this.nudgeEmployee(requestBody);
    },
   
    getWeekHistories(userId) {
      console.log(userId);
      const requestBody = {
        payload: {
          emplId: userId, 
          startDate: this.startdate,
          endDate: this.enddate
        },
        success: this.onSuccessIndividualHistory,
        failure: this.onFailure,
      };
      console.log(requestBody);
      this.getWeekHistory(requestBody);
    },
    onTeamDetailSuccess(){
      const {presentCount,leaveCount,wfhCount,totalCount}=this.todayTeamDetails
      console.log(presentCount);
      console.log(leaveCount);
      console.log(wfhCount);
      console.log(totalCount);
      this.progressvalue=(presentCount/totalCount)*100;

    },
    onTeamDetailFailure(){
      console.log("team details not received");
    }

  },
  components: {
    Calender,
    EmployeeDashboard,
  },
  mounted() {
    this.getSubordinatesRequests({
      success: this.ongettingAllRequestsSuccess,
      failure: this.ongettingAllRequestsFailure,
    });
    this.getAllSubordinates({
      success: this.ongettingAllSubordinatesSuccess,
      failure: this.ongettingAllRequestsFailure,
    });
    this.getTeamDetail({
      success: this.onTeamDetailSuccess,
      failure: this.onTeamDetailFailure,
    })

  },
};
