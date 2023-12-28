// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Employee from '@/views/Employee.vue'
import EmployeeDashBoard from '@/components/EmployeeDashBoard.vue'
import Report from '@/components/Report.vue'
import Calender from '@/components/Calender.vue'
import Home from '@/views/Home.vue'
import Manager from '@/views/Manager.vue'
import ManagerDashBoard from '@/components/ManagerDashBoard.vue'
const routes = [
  {
    path:"/",
    name:'home',
    component:Home
  },
  {
    path: "/employee",
    name:"employee",
    component: Employee,
    children:[
      {
        path:'',
        component:EmployeeDashBoard
      },
      {
        path:'calender',
        component:Calender
      },
      {
        path:'report',
        component:Report
      }
    ],
    beforeEnter: (to, from,next) => {
      if(localStorage.getItem("role")!==null && localStorage.getItem("role")==="employee"){
         next();
      }
      else{
       next('/');
      }
   },
  },
  {
    path:"/manager",
    name:"manager",
    component:Manager,
    children:[
      {
        path:'',
        component:EmployeeDashBoard
      },
      {
        path:'team',
        name:'managerDashboard',
        component:ManagerDashBoard

      },
      {
        path:'calender',
        component:Calender
      },
      {
        path:'report',
        component:Report
      }
    ],
    beforeEnter: (to, from,next) => {
      if(localStorage.getItem("role")!==null && localStorage.getItem("role")==="manager"){
         next();
      }
      else{
       next('/');
      }
   },
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
