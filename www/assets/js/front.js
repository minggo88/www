
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ];

  const data = {
    labels: labels,
    datasets: [{
      backgroundColor: '#2B589B',
      borderColor: '#2B589B',
      borderWidth: 2,
      data: [0, 10 , 5, 2, 20, 30, 45],
      radius: 0,
    }]
  }

  const myChart = new Chart(
    document.getElementById('indexCanvas'),
    {
      type: 'line',
      data: data,
      options: {
          responsive: true,
          layout: {
              padding: 0,
          },
          elements: {
              line: {
                  borderJoinStyle: 'round',
                  tension: 0.1,
              }
          },
          plugins: {
              legend: {
                  display: false,
              }
          },
          scales: {
              xAxes: {
                  display: false,
              },
              yAxes:{
                  ticks: {
                      display: false,
                      stepSize: 25,
                      borderColor: '#777777'
                  },
                  min: 0,
                  max: 100,
                  pointRadus: 0,
              }
          }
      }
    }
  );

  $(function() {
    new Swiper('.news .column .swiper', {
      slidesPerView: 1,
      direction: 'vertical',
      loop: true,
      allowTouchMove: true,
      noSwiping: true,
      noSwipingClass: 'swiper-slide',
      preventInteractionOnTransition:true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
    })
  })