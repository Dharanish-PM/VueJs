import { mapActions, mapState } from "pinia";
import { AttendenceStore } from "../../store/AttendenceStore";

export default {
  data: () => ({
    loading: false,
    passwordShow: false,
    username: "",
    usernameRules: [(v) => !!v || "Username is required"],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      // v => (v && v.length >= 6) || 'Password must be 6  characters or more!',
    ],
    isError:false,
    showErr:true
  }),
  methods: {
    ...mapActions(AttendenceStore, ["getLoginInfo"]),
    onSuccess(role) {
      this.loading=false;
      if(role==='employee'){
        this.$router.push("/employee");
      }
      else{
        this.$router.push("/manager");
      }

    },
    onFailure() {
      this.loading=false;
      this.isError=true;
      this.showErr=false
      console.log("Failure");
    },
    submitHandler() {
      if (this.username.length > 0 && this.password.length > 0) {
        this.loading = true;
        localStorage.setItem("username", this.username);
        const requestBody = {
          payload: {
            userName: this.username,
            password: this.password,
          },
          success: this.onSuccess,
          failure: this.onFailure,
        };
        this.getLoginInfo(requestBody);
      }
    },
  },
};
