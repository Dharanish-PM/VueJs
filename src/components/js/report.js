import { mapActions, mapState } from "pinia";
import { AttendenceStore } from "../../store/AttendenceStore";
export default {
  data() {
    return {
        allrequestsLoader:true
    };
  },
  computed: {
    ...mapState(AttendenceStore, ["allEmployeeRequest"]),
  },
  methods: {
    ...mapActions(AttendenceStore, ["getAllRequestMade"]),
    getClassName(request) {
      return {
        "status-decline": request.status === "declined",
        "status-approved": request.status === "approved",
        "status-pending": request.status === "pending",
      };
    },
    onSuccess(role) {
        this.allrequestsLoader=false;
    },
    onFailure() {
        
    },
  },
  mounted() {
    this.getAllRequestMade({
      success: this.onSuccess,
      failure: this.onFailure,
    });
  },
};
