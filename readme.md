[![Build Status](https://travis-ci.org/thiagodp/concordialang-codeceptjs-core.svg?branch=master)](https://travis-ci.org/thiagodp/concordialang-codeceptjs-core)
[![npm version](https://badge.fury.io/js/concordialang-codeceptjs-core.svg)](https://badge.fury.io/js/concordialang-codeceptjs-core)
[![GitHub last commit](https://img.shields.io/github/last-commit/thiagodp/concordialang-codeceptjs-core.svg)](https://github.com/thiagodp/concordialang-codeceptjs-core/releases)

# concordialang-codeceptjs-core

> Concordia compiler plug-in core for CodeceptJS

This is not a plug-in, but a plug-in core.

## [What's New](https://github.com/thiagodp/concordialang-codeceptjs-core/releases)

## Installation

```bash
npm i --save concordialang-codeceptjs-core
```

## Documentation

### Integration with CodeceptJS

#### Test Events

| Concordia declaration  | CodeceptJS support (method/other)                                 |
| ---------------------- | ----------------------------------------------------------------- |
| `Before All`           | Manually, through hooks. See [hooks](https://codecept.io/hooks/). |
| `After All`            | Manually, through hooks. See [hooks](https://codecept.io/hooks/). |
| `Before Feature`       | `BeforeSuite`                                                     |
| `After Feature`        | `AfterSuite`                                                      |
| `Before Each Scenario` | `Before` or `Background`                                          |
| `After Each Scenario`  | `After`                                                           |

#### Concordia Actions

The following table lists the support to the [Concordia Language Actions](https://github.com/thiagodp/concordialang/). **The corresponding CodeceptJS commands work with both WebDriverIO and Appium**.

*Note*: A tick (✓) means "*checked with a unit test*".


 | Concordia action                                 | CodeceptJS command                                                                |
 | ------------------------------------------------ | --------------------------------------------------------------------------------- |
 | -                                                | _locate                                                                           |
 | -                                                | _locateCheckable                                                                  |
 | -                                                | _locateClickable                                                                  |
 | -                                                | _locateFields                                                                     |
 | accept + ( alert OR confirm OR popup OR prompt ) | acceptPopup ✓                                                                     |
 | amOn                                             | amOnPage ✓                                                                        |
 | append                                           | appendField ✓                                                                     |
 | attachFile                                       | attachFile ✓                                                                      |
 | cancel + ( alert OR confirm OR popup OR prompt ) | cancelPopup ✓                                                                     |
 | check                                            | checkOption ✓                                                                     |
 | clear + cookie                                   | clearCookie ✓                                                                     |
 | clear                                            | clearField ✓                                                                      |
 | click                                            | click ✓                                                                           |
 | close + app                                      | closeApp ✓ (Appium only)                                                          |
 | close + currentTab                               | closeCurrentTab ✓                                                                 |
 | close + otherTabs                                | closeOtherTabs ✓                                                                  |
 | connect + database                               | N/A - supported via [dbhelper](https://github.com/thiagodp/codeceptjs-dbhelper)   |
 | -                                                | defineTimeout                                                                     |
 | disconnect + database                            | N/A - supported via [dbhelper](https://github.com/thiagodp/codeceptjs-dbhelper)   |
 | not + see                                        | dontSee ✓                                                                         |
 | not + see + checkbox                             | dontSeeCheckboxIsChecked ✓                                                        |
 | not + see + cookie                               | dontSeeCookie ✓                                                                   |
 | not + see + url                                  | dontSeeCurrentUrlEquals ✓                                                         |
 | not + see + ( uielement OR uiliteral )           | dontSeeElement ✓                                                                  |
 | -                                                | dontSeeElementInDOM                                                               |
 | not + see + ( inside OR with ) + url             | dontSeeInCurrentUrl ✓                                                             |
 | not + see + ( textbox OR textarea )              | dontSeeInField ✓                                                                  |
 | -                                                | dontSeeInSource                                                                   |
 | not + see + title                                | dontSeeInTitle ✓                                                                  |
 | doubleClick                                      | doubleClick ✓                                                                     |
 | drag                                             | dragAndDrop ✓                                                                     |
 | -                                                | executeAsyncScript                                                                |
 | -                                                | executeScript                                                                     |
 | fill                                             | fillField ✓                                                                       |
 | -                                                | grabAttributeFrom                                                                 |
 | -                                                | grabBrowserLogs                                                                   |
 | -                                                | grabCookie                                                                        |
 | -                                                | grabCssPropertyFrom                                                               |
 | -                                                | grabCurrentUrl                                                                    |
 | -                                                | grabHTMLFrom                                                                      |
 | -                                                | grabNumberOfOpenTabs                                                              |
 | -                                                | grabNumberOfVisibleElements                                                       |
 | -                                                | grabPageScrollPosition                                                            |
 | -                                                | grabPopupText                                                                     |
 | -                                                | grabSource                                                                        |
 | -                                                | grabTextFrom                                                                      |
 | -                                                | grabTitle                                                                         |
 | -                                                | grabValueFrom                                                                     |
 | hide + keyboard                                  | hideDeviceKeyboard ✓ (Appium only)                                                |
 | install + app                                    | installApp ✓ (Appium only)                                                        |
 | -                                                | locator                                                                           |
 | maximize + window                                | resizeWindow( 'maximize' ) ✓                                                      |
 | move + cursor                                    | moveCursorTo ✓                                                                    |
 | mouseOut                                         | -                                                                                 |
 | mouseOver                                        | -                                                                                 |
 | open + new tab                                   | openNewTab                                                                        |
 | open + notifications                             | openNotifications ✓ (Appium only)                                                 |
 | press                                            | pressKey ✓                                                                        |
 | pull + file                                      | pullFile ✓ (Appium only)                                                          |
 | refresh + currentPage                            | refreshPage ✓                                                                     |
 | refresh + url                                    |                                                                                   |
 | remove + app                                     | removeApp ✓ (Appium only)                                                         |
 | resize + window                                  | resizeWindow ✓                                                                    |
 | rightClick                                       | rightClick ✓                                                                      |
 | run + command                                    | N/A - supported via [cmdhelper](https://github.com/thiagodp/codeceptjs-cmdhelper) |
 | run + script                                     | N/A - supported via [dbhelper](https://github.com/thiagodp/codeceptjs-dbhelper)   |
 | -                                                | runInWeb                                                                          |
 | -                                                | runOnAndroid                                                                      |
 | -                                                | runOnIOS                                                                          |
 | saveScreenshot                                   | saveScreenshot ✓                                                                  |
 | -                                                | scrollTo                                                                          |
 | see                                              | see ✓                                                                             |
 | see + app + installed                            | seeAppIsInstalled ✓ (Appium only)                                                 |
 | see + app + installed + not                      | seeAppIsNotInstalled ✓ (Appium only)                                              |
 | see + ( uielement OR uiliteral ) + attribute + value  | seeAttributesOnElements ✓ |
 | see + ( uielement OR uiliteral ) + class + value      | _(same above)_ |
 | see + ( uielement OR uiliteral ) + style + value      | _(same above)_ |
 | see + checkbox                                   | seeCheckboxIsChecked ✓                                                            |
 | see + cookie                                     | seeCookie ✓                                                                       |
 | -                                                | seeCssPropertiesOnElements                                                        |
 | see + currentActivity + value                    | seeCurrentActivityIs ✓ (Appium only)                                              |
 | see + device + locked                            | seeDeviceIsLocked ✓ (Appium only)                                                 |
 | see + device + unlocked                          | seeDeviceIsUnlocked ✓ (Appium only)                                               |
 | see + ( with OR inside ) + url                   | seeCurrentUrlEquals ✓                                                             |
 | see + ( uielement OR uiliteral )                 | seeElement ✓                                                                      |
 | -                                                | seeElementInDOM                                                                   |
 | see + inside + url                               | seeInCurrentUrl ✓                                                                 |
 | see + ( textbox OR textarea )                    | seeInField ✓                                                                      |
 | -                                                | seeInPopup                                                                        |
 | -                                                | seeInSource                                                                       |
 | see + title                                      | seeInTitle ✓                                                                      |
 | -                                                | seeNumberOfElements                                                               |
 | -                                                | seeNumberOfVisibleElements                                                        |
 | see + orientation + landscape                    | seeOrientationIs("LANDSCAPE") ✓ (Appium only)                                     |
 | see + orientation + portrait                     | seeOrientationIs("PORTRAIT") ✓ (Appium only)                                      |
 | -                                                | seeTextEquals                                                                     |
 | -                                                | seeTitleEquals                                                                    |
 | select                                           | selectOption ✓                                                                    |
 | -                                                | setCookie                                                                         |
 | shake                                            | shakeDevice ✓ (Appium only)                                                       |
 | show                                             | -                                                                                 |
 | swipe + values                                   | swipe ✓ (Appium only)                                                             |
 | swipe + down                                     | swipeDown ✓ (Appium only)                                                         |
 | swipe + left                                     | swipeLeft ✓ (Appium only)                                                         |
 | swipe + right                                    | swipeRight ✓ (Appium only)                                                        |
 | swipe + up                                       | swipeUp ✓ (Appium only)                                                           |
 | swipe + targets                                  | swipeTo ✓ (Appium only)                                                           |
 | switch + native                                  | switchToNative ✓ (Appium only)                                                    |
 | switch + web                                     | switchToWeb ✓ (Appium only)                                                       |
 | switch + tab + number                            | switchToNextTab ✓                                                                 |
 | switch + next + tab                              | switchToNextTab ✓                                                                 |
 | switch + previous + tab                          | switchToPreviousTab ✓                                                             |
 | tap                                              | tap ✓ (Appium only)                                                               |
 | uncheck                                          | uncheckOption ✓                                                                   |
 | wait + number                                    | wait ✓                                                                            |
 | -                                                | waitForDetached                                                                   |
 | wait + uielement                                 | waitForElement ✓                                                                  |
 | wait + enabled + ( uielement OR uiliteral )      | waitForEnabled ✓                                                                  |
 | wait + invisible + ( uielement OR uiliteral )    | waitForInvisible ✓                                                                |
 | wait + text + value                              | waitForText ✓                                                                     |
 | wait + option value + value                      | waitForValue ✓                                                                    |
 | wait + visible + ( uielement OR uiliteral )      | waitForVisible ✓                                                                  |
 | -                                                | waitInUrl                                                                         |
 | -                                                | waitNumberOfVisibleElements ✓                                                     |
 | wait + hide + ( uielement OR uiliteral )         | waitToHide ✓                                                                      |
 | -                                                | waitUntil                                                                         |
 | wait + url + value                               | waitUrlEquals ✓                                                                   |


## See Also

- [concordialang-codeceptjs-webdriverio](https://github.com/thiagodp/concordialang-codeceptjs-webdriverio): plugin for CodeceptJS with WebDriverIO
- [concordialang-codeceptjs-appium](https://github.com/thiagodp/concordialang-codeceptjs-appium): plugin for CodeceptJS with Appium
- [concordialang-plugin](https://github.com/thiagodp/concordialang-plugin): Basic plugin types
- [Concordia](https://github.com/thiagodp/concordialang)


## License

![AGPL](https://www.gnu.org/graphics/agplv3-88x31.png) © [Thiago Delgado Pinto](https://github.com/thiagodp)

[GNU Affero General Public License version 3](LICENSE.txt)
