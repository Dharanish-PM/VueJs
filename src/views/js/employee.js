import { mapActions, mapState } from "pinia";
import { AttendenceStore } from "../../store/AttendenceStore";
export default{
    
    data(){
        return{
            navbarActive:true,
            dialog:false,
            username:localStorage.getItem("username"),
            notificationLoading:false,
            isSidebarClosed: false,
            isSidebarHoverable: false,
      
        }
    },
    computed: {
        ...mapState(AttendenceStore,['allNotifications','updateNotification'])
      },
    methods:{
        ...mapActions(AttendenceStore, ["getNotifications"]),
        toggle(){
            this.navbarActive=!this.navbarActive
        },
       
        logoutFunction(){
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("empId");
            this.$router.push("/");
          },
          onSuccess() {
            this.notificationLoading=false;
           
          },
          onFailure() {
            this.notificationLoading=false;

          },
          getAllNotifications() {     
            this.notificationLoading=true
            this.getNotifications({success:this.onSuccess,failure:this.onFailure});
          },
          updateNotification(curentNotification){
            
            console.log(curentNotification);
            // this.updatote(curentNotification.id);
            this.updateNotification(curentNotification.id)
          },
          updatote(id){
              console.log(id);

          },
          
          toggleSidebar() {
            this.isSidebarClosed = !this.isSidebarClosed;
          },
          closeSidebar() {
            this.isSidebarClosed = true;
            this.isSidebarHoverable = true;
          },
          expandSidebar() {
            this.isSidebarClosed = false;
            this.isSidebarHoverable = false;
          },
          handleResize() {
            this.isSidebarClosed = window.innerWidth < 768;
          }

    },
    mounted(){
        this.getAllNotifications();
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }
}