/*
UUsing JavaScript in your browser only, you will listen for the form's submit event; when the form is submitted, you will:

*/

(function () {
//     let num1 = document.getElementById('fibonacci_index_input');
//     const serverForm = document.getElementById('fibonacciForm');
//     const resultsList = document.getElementById('fibonacciResults');
//     let errorDiv = document.getElementById('error');
//     let frmLabel = document.querySelector('label[for="fibonacci_index_input"]');
//     const checkIsProperNumber = (val) => {
//       if(!val && val !== 0){
//         return true;
//       }
//       if(val == ""){
//         return true;
//       }
//       if (typeof val !== 'string'){
//         return true;
//       }
//       const parsedValue = parseInt(val, 10);
//       if(val !== parsedValue.toString()){
//         console.log(val);
//         console.log(parsedValue.toString());
//         return true;
//       }
//       return false;
//     };
//     function calculateFibonacci(n) {
//         if (n < 1) return 0;
//         if (n === 1) return 1;
//         let a = 0, b = 1;
//         for (let i = 2; i <= n; i++) {
//           [a, b] = [b, a + b];
//         }
//         return b;
//     }
      
//     function checkPrime(num) {
//         if (num < 2) return false;
//         for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
//           if (num % i === 0) return false;
//         }
//         return true;
//     }
  
//     if (serverForm) {
//       serverForm.addEventListener('submit', (event) => {
//         event.preventDefault();
//         let i = num1.value.trim();
//         let errors = checkIsProperNumber(i);
//         const index = parseInt(i, 10);
//         if(errors || typeof index !== 'number' || isNaN(index)){
//           num1.value = '';
//           errorDiv.hidden = false;
//           errorDiv.innerHTML = 'You must enter a value';
//           frmLabel.className = 'error';
//           num1.focus();
//           num1.className = 'inputClass';

//         }
//         else{
//           errorDiv.hidden = true;
//           num1.classList.remove('inputClass');
//           frmLabel.classList.remove('error');
//           let fibonacciValue = calculateFibonacci(index);
//           const isPrime = checkPrime(fibonacciValue);
//           let resultItem = document.createElement('li');
//           resultItem.innerHTML = `The Fibonacci of ${index} is ${fibonacciValue}.`;
//           resultItem.classList.add(isPrime ? 'is-prime' : 'not-prime');
//           resultsList.appendChild(resultItem);
//           serverForm.reset();
//           num1.focus();
//         }
//       });
//     }
 })();

