import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarProps {
  onDayPress: (date: string) => void;
  markedDates: { [key: string]: { marked: boolean } };
}

export const Calendar: React.FC<CalendarProps> = ({
  onDayPress,
  markedDates,
}) => {
  return (
    <View style={styles.container}>
      <RNCalendar
        onDayPress={(day: { dateString: string }) => onDayPress(day.dateString)}
        markedDates={markedDates}
        theme={{
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          dotColor: "#00adf5",
          selectedDotColor: "#ffffff",
          arrowColor: "#00adf5",
          monthTextColor: "#00adf5",
          indicatorColor: "#00adf5",
        }}
        locale="fr"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
