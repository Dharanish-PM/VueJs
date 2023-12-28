<template>
   <div class="main-content">
    <h1 class=""> </h1>
    <v-progress-circular
            indeterminate
            color="primary"
            v-if="allrequestsLoader"
            class="loader"
          ></v-progress-circular>
    <table v-else>
          <thead>
            <tr>
              <th>Request Made</th>
              <th>Applied On</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in allEmployeeRequest" :key="index">
              <td class="actions">{{ request.actionType }}</td>
              <td>{{ request.createdDate}}</td>
              <td>{{ request.actionStarted }}</td>
              <td>{{ request.actionEnded }}</td>
              <td>
                <p :class="getClassName(request)">{{ request.status }}</p>
              </td>
             
            </tr>
          </tbody>
        </table>
    </div>
    

</template>
<script src="./js/report"></script>
<style scoped>
table{
    border-collapse: collapse;
    box-shadow: 0 5px 10px #e1e5ee;
    background-color: white;
    text-align: left;
    overflow: hidden;
    border-radius: 15px;
    margin-top: 2rem;
    width: 80%;
}
thead{
    box-shadow: 0 5px 10px #e1e5ee;

}
.actions{
  text-transform: capitalize;
}
th{
    padding: 1rem 2rem;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 15px;
}
td{
    padding:1rem 2rem  ;
}
tr:nth-child(even){
    background-color: #f4f6fb;
}
.status-decline {
  border-radius: 10px;
  background-color: #ffcdd2;
  color: #c62828;
  padding: 0.2rem 1rem;
  text-align: center;
  text-transform: capitalize;
}
.status-pending {
  border-radius: 10px;
  background-color: #fff0c2;
  color: #a68b00;
  padding: 0.2rem 1rem;
  text-align: center;
  text-transform: capitalize;
}
.status-approved {
  border-radius: 10px;
  background-color: #c8e6c9;
  color: #388e3c;
  padding: 0.2rem 1rem;
  text-align: center;
  text-transform: capitalize;
}
.main-content{
    display: flex;
    margin-top: 2rem;
    flex-direction: column;
    align-items: center;
    width: 80%;
}
.head{
  background:#f44064;
  color: white;
  font-size: 30px;
  margin-top:10px;
  padding: 5px 10px;
  border-radius: 10px;
}
@media (max-width: 767px) {
  th{
    padding: 0.5rem 1rem;

  }
}

</style>