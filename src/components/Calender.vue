<template>
  <FullCalendar
    :options="calendarOptions"
    class="calender"
    @dayCellDidMount="customDayCellDidMount"
  >
  </FullCalendar>
</template>
<script src="./js/calender"></script>
<style scoped>
.calender {
  margin: 5rem auto;
  width: 80%;

}

</style>
