# FSD учебный проект слайдера
## Ссылка на слайдеры
https://mvodev.github.io/FSDCourse4/. 
## Пример инициализации:
```
var $sl1 = $('.slider');
$sl1.fsdSlider({
 min: -15, 
 max: -10, 
 from: -14, 
 step: 0.2,
 to: -11,
 isVertical: false,
 hideThumbLabel: false,
 isRange: true,
 onChange: callback,
 onStart: callback,
});
```
min - обязательное поле,минимальное значение диапазона значений слайдера.

max - обязательное поле,максимальное значение диапазона значений слайдера.

from - обязательное поле,значение ползунка слайдера при одиночном значении слайдера
и значение диапазона "ОТ" при слайдере диапазона.

to - необязательное поле,значение диапазона "ДО" при слайдере диапазона.

step - параметр, которому будут кратны значения слайдера при изменении ползунка слайдера.

isVertical - булево значение данного параметра позволяет установить вертикальный или горизонтальный режим отображения слайдера,устанавливается один раз,режим отображения не меняется при попытке передать новое значение isVertical в методе update слайдера.

isRange - булево значение true данного параметра позволяет установить слайдер в режиме диапазона значений "ОТ" - "ДО".

onChange,onStart,onUpdate -callbacks,вызываемые при инициализации и изменении значений слайдера соответственно. В функцию передается копия настроек слайдера в момент срабатывания callback.

## Пример callback:
```
function callback(result) {
 //result - значение настроек слайдера в формате JSON
 var s = JSON.parse(result);
 $('.slider__input').val(s.from + ' - '+s.to);
}
```
## Настройки по умолчанию
```
 {
  min: 0,
  max: 10,
  from: 5,
  isRange: false,
  isVertical: false,
  hideThumbLabel: false,
  onStart: undefined,
  onChange: undefined,
  onUpdate:undefined,
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

 Presenter - реализует интерфейс IObserver , связующее звено между View и Model, подписан на обновления Model и View, при получении изменений обновляет View и Model.

 ## UML диаграмма классов:
 
