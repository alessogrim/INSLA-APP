import 'react-native';
import React from 'react';
import Register from '../src/Components/Register/Register'
import renderer from 'react-test-renderer';

it('Using a valid email', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('cesarabelfigueroa@gmail.com', 'email')).toEqual(true);
});

it('Using a invalid email without .com', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('cesarabelfigueroa@', 'email')).toEqual(false);
});

it('Using a invalid email without @', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('cesarabelfigueroa@', 'email')).toEqual(false);
});

it('Using a invalid email with a letter', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('cesarabelfigueroa@', 'email')).toEqual(false);
});

it('Using a valid password', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('abcdefgh1H', 'password')).toEqual(true);
});

it('Using a invalid password', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('', 'password')).toEqual(false);
});

it('Using a invalid password without upper case', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('bcdefgh1', 'password')).toEqual(false);
});

it('Using a invalid password with 5 characters', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('bcdef', 'password')).toEqual(false);
});


it('Using a valid name', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('Cesar', 'name')).toEqual(true);
});


it('Using a invalid name', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('', 'name')).toEqual(false);
});


it('Using a valid lastname', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('Figueroa', 'lastname')).toEqual(true);
});


it('Using a invalid lastname', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('', 'lastname')).toEqual(false);
});

it('Using a valid phone number', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('33567265', 'phone')).toEqual(true);
});

it('Using a valid phone number', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('335665', 'phone')).toEqual(false);
});

it('Using a valid location', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('Barrio Casamata', 'location')).toEqual(true);
});


it('Using a invalid location', () => {
    jest.useFakeTimers(); 
    let Interface = renderer.create(<Register />).getInstance();
    expect(Interface.evaluation('==', 'location')).toEqual(false);
});