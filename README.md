# Regex Rejects

#### Epicodus | 08.29.16
###### _By **Peter Armington // Alex Leibler // Kyle Fisher**_

## **//** Description

A front end app which allows users to learn Regular Expressions by participating in a game that challenges one to conform!

## **//** Installation Requirements/Instructions

1. Clone the repository found at https://github.com/KomodoTech/regexGame.git
2. Open the file titled "index.html" in your web browser.

_Or_, using your web browser, navigate to the gh-page: https://KomodoTech.github.io/regexGame

## **//** Support and contact details

Contact kyle@kylefisher.com or peter.armington@gmail.com for more information.

## **//** Technologies Used

* HTML
* CSS
* Bootstrap
* JQuery
* Javascript

#### **//** **Specifications**
**___________________________________________________________**

* User is given a Regular Expression and asked to provide a string that matches:

* Tier 1 problems:
  Ex1:
    + prompt: /A/
    + input:  A
    + output: accept

  Ex2:
    + prompt: /A/
    + input: 1hAl
    + output: accept

  Ex3:
    + prompt: /A/
    + input: baB
    + output: reject

* Tier 2 problems:
  Ex1:
    + prompt: /(AB|BC)/
    + input: AB
    + output: accept

  Ex2:
    + prompt: /(AB|BC)/
    + input: BC
    + output: accept

  Ex3:
    + prompt: /(AB|BC)/
    + input: BA
    + output: reject

  * Tier 3 problems:
    Ex1:
      + prompt: /^(AB|BC)/
      + input: ABgjkdl
      + output: accept

    Ex2:
      + prompt: /^(AB|BC)/
      + input: BCAbb
      + output: accept

    Ex3:
      + prompt: /^(AB|BC)/
      + input: CBabAB
      + output: reject

========================================================

* User is prompted with a string and asked to supply a regular expression which woulds select that string.
  * Example:
    + prompt: kiosk
    + input : /^k/
    + output: accept

### License

Copyright (c) 2016 **Kyle Fisher, Peter Armington, Alex Leibler** **//**
