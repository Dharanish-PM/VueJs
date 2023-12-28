<template>
  <nav class="navbar">
    <div class="logo">
      <i class="bx bx-menu" @click="toggleSidebar" id="sidebarOpen"></i>
      <i class="bx bxl-codepen"></i>
      <span>AttendenceMgt</span>
    </div>
  </nav>
  <nav
    :class="{
      close: isSidebarClosed,
      hoverable: isSidebarHoverable,
      sidebar: true,
    }"
  >
    <div class="menu_content">
      <ul class="menu_items">
        <li class="menu_item">
          <a href="#" class="nav_link">
            <span class="navlink_icon">
              <i class="bx bxs-user"></i>
            </span>
            <span class="navlink">{{ username }}</span>
          </a>
        </li>

        <li class="menu_item">
          <router-link to="/employee/">
            <a class="nav_link">
              <span class="navlink_icon">
                <i class="bx bxs-grid-alt"></i>
              </span>
              <span class="navlink">DashBoard</span>
            </a>
          </router-link>
        </li>
        <li class="menu_item">
          <router-link to="/employee/report">
            <a href="#" class="nav_link">
              <span class="navlink_icon">
                <i class="bx bxs-food-menu"></i>
              </span>
              <span class="navlink">Report</span>
            </a>
          </router-link>
        </li>
        <li class="menu_item">
          <router-link to="/employee/calender">
            <a href="#" class="nav_link">
              <span class="navlink_icon">
                <i class="bx bxs-calendar"></i>
              </span>
              <span class="navlink">Calender</span>
            </a>
          </router-link>
        </li>
       
        <li class="menu_item">
          <v-row>
            <a
              href="#"
              class="nav_link"
              @click.prevent="handleClick"
              @click.stop="dialog = true"
            >
              <span class="navlink_icon">
                <i class="bx bxs-bell bellNotify"></i>
              </span>
              <span class="count">{{ allNotifications.length }}</span>
              <span class="navlink notifytxt">Notification</span>
            </a>

            <v-dialog v-model="dialog" max-width="290">
              <v-card>
                <v-card-title class="text-h5 "> Notifications </v-card-title>

                <v-progress-circular
                  indeterminate
                  color="primary"
                  v-if="notificationLoading"
                  class="loader"
                ></v-progress-circular>

                <v-expansion-panels v-else class="panel">
                  <v-expansion-panel
                    @click="updateNotification"
                    v-for="(notification, index) in allNotifications"
                    :key="index"
                  >
                    <v-expansion-panel-title disable-icon-rotate>
                      <img
                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                        alt=""
                        class="user-img"
                      />
          
                      username
                      <template v-slot:actions>
                        <v-icon color="error" icon="mdi-alert-circle"> </v-icon>
                      </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      {{ notification.notificationMessage }}
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green-darken-1"
                    variant="text"
                    @click="dialog = false"
                  >
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </li>

        <li class="menu_item">
          <router-link to="/">
            <a href="#" class="nav_link" @click="logoutFunction">
              <span class="navlink_icon">
                <i class="bx bx-log-out"></i>
              </span>
              <span class="navlink">Logout</span>
            </a>
          </router-link>
        </li>
      </ul>
      <div class="collapse_content">
        <div @click="expandSidebar" class="collapse expand_sidebar">
          <span> Expand</span>
          <i class="bx bx-chevron-right"></i>
        </div>
        <div @click="closeSidebar" class="collapse collapse_sidebar">
          <span> Collapse</span>
          <i class="bx bx-chevron-left"></i>
        </div>
      </div>
    </div>
  </nav>

  <div class="main-content">
    <router-view></router-view>
  </div>
</template>
<script src="./js/employee"></script>
<style>
.count {
  position: relative;
  right: 10px;
  bottom: 13px;
}
.bellNotify{
  position: relative;
  left: 10px;
  margin: 15px 0;
}

.notifytxt{
  position: relative;
  right: -1px;
}

.user-img {
  width: 50px;
  height: 45px;
  border-radius: 100%;
  border: 1px solid #eee;
}
body {
  background-color: #f1f1f1;
  transition: all 0.5s ease;
}
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  left: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  z-index: 1000;
  box-shadow: 0 0 2px #aaa;
}
.logo {
  display: flex;
  align-items: center;
  column-gap: 10px;
  font-size: 22px;
  font-weight: 500;
  color: #f44064;
}
.sidebar {
  background-color: #fff;
  width: 260px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  padding: 80px 20px;
  z-index: 100;
  overflow-y: scroll;
  box-shadow: 0 0 1px #aaa;
  transition: all 0.5s ease;
}
.sidebar.close {
  padding: 60px 0;
  width: 80px;
}
.sidebar::-webkit-scrollbar {
  display: none;
}
.menu_content {
  position: relative;
}
.menu_title {
  margin: 15px 0;
  padding: 0 20px;
  font-size: 18px;
}
.sidebar.close .menu_title {
  padding: 6px 30px;
}
.menu_title::before {
  color: #434141;
  white-space: nowrap;
}

.sidebar.close .menu_title::before {
  content: "";
  position: absolute;
  height: 2px;
  width: 18px;
  border-radius: 12px;
  background: #aaa;
}
.menu_items {
  padding: 0;
  list-style: none;
}
.navlink_icon {
  position: relative;
  font-size: 22px;
  min-width: 50px;
  line-height: 40px;
  display: inline-block;
  text-align: center;
  border-radius: 6px;
}
.navlink_icon::before {
  content: "";
  position: absolute;
  height: 100%;
  width: calc(100% + 100px);
  left: -20px;
}
.navlink_icon:hover {
  background: #f44064;
}
.sidebar .nav_link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 15px;
  border-radius: 8px;
  text-decoration: none;
  color: #434141;
  white-space: nowrap;
}
.sidebar.close .navlink {
  display: none;
}
.nav_link:hover {
  color: #fff;
  background: #f44064;
}
.sidebar.close .nav_link:hover {
  background: #fff;
}

.collapse_content {
  position: fixed;
  bottom: 60px;
  left: 0;
  width: 260px;
  cursor: pointer;
  transition: all 0.5s ease;
}
.collapse {
  position: absolute;
  display: flex;
  align-items: center;
  left: 0;
  justify-content: space-around;
  padding: 18px 0;
  text-align: center;
  width: 100%;
  color: #434141;
  border-top: 1px solid #aaa;
  background-color: #fff;
}
.collapse i {
  font-size: 20px;
}
.collapse span {
  font-size: 18px;
}
.sidebar.close .collapse_content {
  width: 50px;
  left: 15px;
}
.sidebar.close .collapse span {
  display: none;
}
.sidebar.hoverable .collapse_sidebar {
  display: none;
}
#sidebarOpen {
  display: none;
}
a{
  text-decoration: none;
}
@media screen and (max-width: 768px) {
  #sidebarOpen {
    font-size: 25px;
    display: block;
    margin-right: 10px;
    cursor: pointer;
    color: #434141;
  }
  .sidebar.close {
    left: -100%;
  }
  .sidebar.close .collapse_content {
    left: -100%;
  }
}

.main-content {
  position: relative;
  min-height: 100vh;
  transition: all 0.5s ease;
  margin: 4rem auto;
 } 
.loader{
  margin: 0 auto;

}

</style>
