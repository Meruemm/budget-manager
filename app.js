 
// Budget Controller
var budgetController = (function() {
     
   var  Expense = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
       this.percentage = -1;
   };
    
    Expense.prototype.calcPercentage = function(totalIncome) {
        
        if(totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }; 
    
    Expense.prototype.getPercentages = function() {
        return this.percentage;
};
    
    var  Income = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
    };
     
    var calculateTotal = function(type) {
      var sum = 0;
        data.allItems[type].forEach(function(cur){
           sum += cur.value;
            
            
        });
        data.totals[type] = sum;
        
        /*
        0
        [200, 400, 100]
        sum = 0 + 200
        sum = 200 + 400
        sum = 600 + 100 = 700
        */
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        
        budget: 0,
        percentage: -1 
        
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
            
            // Create new ID
            
            if(data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
            newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            
            //Push it into our data structure 
            data.allItems[type].push(newItem);
            
            //Return the element
            return newItem;
        },
        
        deleteItem: function(type, id) {
            //id = 3
            //data.allItems[type][id];
            // ids =[1 2 4 6 8]
            //index = 3
          var ids = data.allItems[type].map(function(current){
               return current.id;
           });
            
            index = ids.indexOf(id);
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        calculateBudget: function() {
            
             // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            
            // calculate the  budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income the we spent
            if(data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
            } else {
                data.percentage = -1;
            }
            // Expense = 100 and income 200, spent 50% = 100/200 = 0.5 * 100
        },
        
        calculatePercentage: function() {
        
            /*
            a =20
            b =10
            c = 40
            income = 100
            a = 20/100 = 20%
            b=10/100 =10%
            c = 40/100 = 50%
            */
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);   
                
            });
        },
        
        getPercentages: function(){
            var alLPerc = data.allItems.exp.map(function(cur){
               return cur.getPercentages(); 
            });
            return alLPerc;
        },
        
        
        getBudget: function() {
          return {
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          }  
        },
        
        // Only for testing our data structure
        testing: function() {
            console.log(data);
        }
    };
     
 })();


    

//UI controller
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescrption: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        containter: '.container',
        expensesPercLabel: '.item__percentage',
        dataLabel: '.budget__title--month'
    };
    
    var formatNumber = function(num, type) {
           var numSplit, int, dec, type;
           /*
           + or - before number
           exactly 2 decimal points comma separating the
           thousands 
           
           2310.4567 -> + 2,310.46
           2000 -> + 2,000.00
           */
           
           // Math.abs simply removes the sign of the number 
           num = Math.abs(num);
           
           // ToFixed is the method of the number prototype
           // what it does is excatly puts 2 decimal numbers on number on which we call methods
           num = num.toFixed(2);
           
           numSplit = num.split('.')
           
           int = numSplit[0];
           if (int.length > 3){
              int =  int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3); // input 2310 output 2,310
           }
           dec = numSplit[1];
           
           // type === 'exp' ? sign '-' : sing = '+';
           
           return  (type === 'exp' ?  '-' : '+') + ' ' + int + '.' + dec;
       };
    
        var nodeListForEach = function(list, callback){
               for(var i = 0; i < list.length; i++){
                   callback(list[i], i);
               }
           };
   return {
       getInput: function() {
           return {
              type: document.querySelector(DOMstrings.inputType).value,// will  be eithier inc or exp
            description: document.querySelector(DOMstrings.inputDescrption).value, 
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
           };
           
       },
       
       addListItem: function(obj, type) {
           var html, newHtml, element;
           // Create HTML string with place holder text
           
           if (type === 'inc'){
               element = DOMstrings.incomeContainer;
         html ='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           } else if( type === 'exp'){
               element = DOMstrings.expensesContainer;
            
            html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           }
           // Replace the placeholder text with some actual data 
           newHtml = html.replace('%id%', obj.id);
           newHtml = newHtml.replace('%description%', obj.description);
           newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
           
           // Insert the HTML into the DOM
           document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
           
       },
       
       deleteListItem: function(selectorID) {
           var el = document.getElementById(selectorID);
           el.parentNode.removeChild(el);
           
       },
       
       clearFields: function() {
           var fields, fieldsArr,
         fields =document.querySelectorAll(DOMstrings.inputDescrption + ', ' + DOMstrings.inputValue);
           
           var fieldsArr = Array.prototype.slice.call(fields);
           
           fieldsArr.forEach(function(current, index, array){
               current.value = "";
               
           });
           
           fieldsArr[0].focus();
       },
       
       displayBudget: function(obj){
           var type;
           obj.budget > 0 ? type = 'inc' : type = 'exp';
           
           document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
           document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
           document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
           
           if (obj.percentage > 0) {
               document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
           } else {
               document.querySelector(DOMstrings.percentageLabel).textContent = '---';
           }
       }, 
       
       displayPercentages: function(percentages) {
           
           var  fields = document.querySelectorAll(DOMstrings.expensesPercLabel); 
           
           var nodeListForEach = function(list, callback){
               for(var i = 0; i < list.length; i++){
                   callback(list[i], i);
               }
           };
           
           nodeListForEach(fields, function(current, index) {
               
               if (percentages[index] > 0){
               current.textContent = percentages[index] + '%';
               } else {
                   current.textContent = '---';
               }
           });
                           
       },
       
       displayMonth: function() {
           var now, months, month, year;
         var now = new Date();
          // var Eid = new Date(2020,05, 24);
           
           months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
           month = now.getMonth();
           
           year = now.getFullYear();
           document.querySelector(DOMstrings.dataLabel).textContent = months[month] + ' ' + year;
       },
       
       changedType: function() {
         var fields = document.querySelectorAll(
         DOMstrings.inputType + ',' +
         DOMstrings.inputDescrption + ',' +
             DOMstrings.inputValue);
           
           nodeListForEach(fields, function(cur){
              cur.classList.toggle('red-focus');
               
           });
           
           document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
       },
     
       getDOMstrings: function() {
           return DOMstrings;
       }
   };
    
})();



// Global App controller
 var controller = (function(budgetCtrl, UICtrl) {
     
     
     
     var setupEventListeners = function() {
         var DOM = UICtrl.getDOMstrings();
         
         document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
                                                          
     document.addEventListener('keypress', function(event){
         
         if (event.keyCode === 13 || event.which === 13 ) { 
             ctrlAddItem();
         }
         
     });
         document.querySelector(DOM.containter).addEventListener('click', ctrlDeleteItem);
         
         document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
 };
     
     
     var updateBudget = function() {
         // 1. Calculate the budget 
         budgetCtrl.calculateBudget();
         
         // 2. Return the budget
         var budget = budgetCtrl.getBudget();
         
         // 5. Display the budget on the UI
         UICtrl.displayBudget(budget);
         
     };
     
     var updatePercentages = function() {
         // 1 Calculate percentages
         budgetCtrl.calculatePercentage();
         
         // 2 Read percentages from the budget controller 
        var percentages =  budgetCtrl.getPercentages();
         // 3 Update the Ui with the new percentages
           UICtrl.displayPercentages(percentages);
     };
     
     
     var ctrlAddItem = function() {
         var input, newItem;
         //  1. Get the field input data
         input = UICtrl.getInput(); 
         
         if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
             
              //  2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
         
         //  3. Add the item to the UI
         UICtrl.addListItem(newItem, input.type);
         
         //4. Clear the fields
         UICtrl.clearFields();
         
         //  5. Calculate and update budget
         updateBudget();
             
         // 6. Calculate and update percentages
             updatePercentages();
                 
             
         }
         
         
     };
     
     var ctrlDeleteItem = function(event) {
         var itemID, splitID , type, ID;
         itemID =event.target.parentNode.parentNode.parentNode.parentNode.id;
       if (itemID) {
           
           //inc-1
           splitID = itemID.split('-');
           type = splitID[0];
           ID = parseInt(splitID[1]);
           
           // 1. delete the item from the data structure 
           budgetCtrl.deleteItem(type, ID);
           
           // 2. Delete the item from the UI
           UICtrl.deleteListItem(itemID);
           
           // 3. Update the show the new budget
           updateBudget();
           
           // 4. Calculate and update percentages
             updatePercentages();
       }
           
         
     };
     
     return {
         init: function() {
             console.log('Application has started.');
             UICtrl.displayMonth();
             UICtrl.displayBudget({ 
              budget: 0,
              totalInc: 0,
              totalExp: 0,
              percentage: -1
          });
             setupEventListeners();
         }
     };
 })(budgetController, UIController);

controller.init();


