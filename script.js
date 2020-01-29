"use strict";

let productsArr = [];
let errorValidate = new Map();

//добавление товара
productSave.onclick = function () {

    for (let entry of errorValidate) {
        entry[0].classList.remove("errorValidate");
        document.querySelector("div." + entry[0].name).innerText = "";
    }
    //очистили массив с ошибками
    errorValidate.clear();
    //запустили проверки
    validateName();
    validateCount();
    validatePrice();
    //проверка на пустоту массива с ошибками
    if (errorValidate.size !== 0) {
        for (let entry of errorValidate) {
            entry[0].className = "errorValidate";
            document.querySelector("div." + entry[0].name).innerText = entry[1];
        }
    } else {
        newProductPrice.value = newProductPrice.value.slice(1);
        newProductCount.value = newProductCount.value.slice(1, -1);
        productsArr.push({
            name: newProductName.value,
            count: newProductCount.value,
            price: newProductPrice.value
        });
        delete productsArr[newProductKey.value];
        showProducts(productsArr);

    }
};
//кнопка addNew
document.addEventListener('click', function (e) {
    if (e.target && e.target.className == 'addNew') {
        newProductName.value = '';
        newProductCount.value = '';
        newProductPrice.value = '';
        productSave.innerHTML = 'add';
    }
});
//редактирование
document.addEventListener('click', function (e) {
    if (e.target && e.target.className == 'editProduct') {
        let row = e.target.closest("tr");
        let idProduct = e.target.id

        idProduct = parseInt(idProduct.replace(/\D+/g, ""));
        newProductName.value = row.querySelector('.name').innerHTML;
        newProductCount.value = row.querySelector('.count').innerHTML;
        newProductPrice.value = row.querySelector('.price').innerHTML;
        newProductKey.value = idProduct;
        productSave.innerHTML = 'update';
    }
});
//удаление
document.addEventListener('click', function (e) {
    if (e.target && e.target.className == 'deleteProduct') {
        if (confirm('Выдействительно хотитет удалить товар')) {

            let idProduct = e.target.id
            idProduct = parseInt(idProduct.replace(/\D+/g, ""));

            delete productsArr[idProduct];
            showProducts(productsArr);

        }
    }
});
//отрисовка таблицы
function showProducts(productsShow) {
    let tbodyContent = '';
    for (let key in productsShow) {
        tbodyContent += '<tr>' +
            '<td>' +
            '<div class="table_space_between"> <span class="name">' + productsShow[key]['name'] + '</span>' +
            ' <span class="count">(' + productsShow[key]['count'] + ')</span>' +
            '</div></td>' +
            '<td>' +
            '<span class="price">$' + productsShow[key]['price'] + '</span>' +
            '</td>' +
            '<td><button id="edit' + key + '" class="editProduct">Edit</button><button id="del' + key + '" class="deleteProduct">Delete</button></td>' +
            '</tr>';
    }
    document.querySelector('tbody').innerHTML = tbodyContent;
    newProductName.value = '';
    newProductCount.value = '';
    newProductPrice.value = '';
}
//сортировка по имени
sort_count.onclick = function () {
    this.classList.toggle("rotate");
    if (this.classList.contains("rotate")) {
        //по возрастанию
        productsArr = productsArr.sort(function (a, b) {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 0;
        });
    } else {
        //по убыванию
        productsArr = productsArr.sort(function (a, b) {
            if (a.name < b.name) {
                return 1;
            }
            if (a.name > b.name) {
                return -1;
            }
            return 0;
        });
    }
    showProducts(productsArr);
};
//сортировка по цене
sort_price.onclick = function () {
    this.classList.toggle("rotate");
    if (this.classList.contains("rotate")) {
        //по возрастанию
        productsArr = productsArr.sort((prev, next) => prev.price - next.price);
        showProducts(productsArr);
    } else {
        //по убыванию
        productsArr = productsArr.sort((prev, next) => next.price - prev.price);
        showProducts(productsArr);
    }
};
//фильтрация
searchBtn.onclick = function () {

    function filterItems(query) {
        return productsArr.filter(function (el) {
            return el.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
        })
    }
    showProducts(filterItems(searchInput.value));
}

//--------------ВАЛИДАЦИЯ---------------
//поле name
function validateName() {
    if (newProductName.value == '') {
        errorValidate.set(newProductName, "Поле не должно быть пустым");
    }
    if (newProductName.value.length > 15) {
        errorValidate.set(newProductName, "Максимальная длина 15 букв");
    }
    //обрезали пробелы
    newProductName.value = newProductName.value.replace(/^\s*(.*)\s*$/, '$1');
}
//поле count
function validateCount() {
    if (newProductCount.value.length > 10) {
        errorValidate.set(newProductCount, "Максимальная длина 10 букв");
    }
    if (newProductCount.value == '') {
        errorValidate.set(newProductCount, "Поле не должно быть пустым");
    }
}
//поле price
function validatePrice() {
    if (newProductPrice.value == '') {
        errorValidate.set(newProductPrice, "Поле не должно быть пустым");
    }
}
//запрет на вставление
newProductCount.oncut = newProductCount.oncopy = newProductCount.onpaste = function (event) {
    return false;
};
newProductPrice.oncut = newProductPrice.oncopy = newProductPrice.onpaste = function (event) {
    return false;
};
//ввод только цифр
newProductCount.addEventListener('input', function () {
    this.value = this.value.replace(/[^\d]/g, '');
});
newProductPrice.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9.]/g, '');
});
//маска для цены
newProductPrice.addEventListener('blur', function (e) {
    e.target.value = "$" + new Intl.NumberFormat('de-DE').format(e.target.value);
});