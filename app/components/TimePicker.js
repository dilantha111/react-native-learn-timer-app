import React from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export function TimePicker({items, value, onValueChange}) {

    return (
        <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            style={{
                ...pickerSelectStyles
            }}
            onValueChange={onValueChange}
            value={value}
            items={items}
        />
    );

}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        color: "#fff",
        fontSize: 90
    },
    inputAndroid: {
        color: "#fff",
        fontSize: 90
    },
});