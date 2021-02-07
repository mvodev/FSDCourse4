# FSD учебный проект слайдера
## Страница проекта
https://mvodev.github.io/FSDCourse4/
## Запуск проекта
npm run dev
## Запуск тестов
npm run test
## Пример инициализации:
```
$sl1.fsdSlider({
 min: -15,
 max: -10,
 from: -14,
 step: 0,
 to: -11,
 isVertical: false,
 hideThumbLabel: false,
 isRange: true
}, 
{
 handleEvent: (message, result) => {
  var s = JSON.parse(result)
  if (s.isRange) {
   $sl1_input.val(s.from + '  -  ' + s.to);
  }
  else {
   $sl1_input.val(s.from);
  }
 }
});
```
min - обязательное поле,минимальное значение диапазона значений слайдера.

max - обязательное поле,максимальное значение диапазона значений слайдера.

from - обязательное поле,значение ползунка слайдера при одиночном значении слайдера
и значение диапазона "ОТ" при слайдере диапазона.

to - необязательное поле,значение диапазона "ДО" при слайдере диапазона.

step - параметр, которому будут кратны значения слайдера при изменении ползунка слайдера.

isVertical - булево значение данного параметра позволяет установить вертикальный или горизонтальный режим отображения слайдера,устанавливается один раз,режим отображения не меняется при попытке передать новое значение isVertical в методе update() слайдера.

isRange - булево значение true данного параметра позволяет установить слайдер в режиме диапазона значений "ОТ" - "ДО", устанавливается один раз,не меняется при вызове метода update() слайдера.

## Пример callback:
```
var $sl1_input = $('.input-result1');
{
 handleEvent: (message, result) => {
  var s = JSON.parse(result)
  if (s.isRange) {
   $sl1_input.val(s.from + '  -  ' + s.to);
  }
  else {
   $sl1_input.val(s.from);
  }
 }
}
```
Передайте объект,содержащий функцию handleEvent.
## Настройки по умолчанию
```
 {
  min: 0,
  max: 10,
  from: 5,
  isRange: false,
  isVertical: false,
  hideThumbLabel: false,
 };
 ```
 ## API:
 ```
 var sl1_instance = $sl1.data("fsdSlider");
 sl1_instance.update(newSettings); - возможность передать новые настройки в слайдер
 ```
## Описание проекта:
### Основные классы:
 EventObservable -реализует интерфейс IObservable,позволяет наблюдателю подписываться на изменения класса.

 IObserver - интерфейс наблюдатель.

 Model - содержит все настройки слайдера,реализует интерфейс IObservable,позволяет слушателям подписываться на свои изменения.

 View - отображение слайдера. Реализует интерфейс IObservable,позволяет слушателям подписываться на свои изменения.

 Presenter - реализует интерфейс IObserver , связующее звено между View и Model, подписан на обновления Model и View, при получении уведомлений об изменениях обновляет View и Model.

 ## UML диаграмма классов:
 https://mvodev.github.io/FSDCourse4/FSDCourse4UMLDiagram.png

 ## Изменения настроек слайдера на контрольной панели
 Введите значение в соответствующее поле на контрольной панели и нажмите ВВОД 