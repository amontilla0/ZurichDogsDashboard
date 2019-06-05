function loadWait() {

   if (dataCleaned) {
     topBreedsChart();
     wordCloud();
     dogsByYearChart();
     breedsLineChart();
   }
   else {
     // wait continuously until all the information is initially loaded.
     setTimeout(loadWait, 50);
   }
 }

loadWait();
