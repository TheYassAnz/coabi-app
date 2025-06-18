import React from "react";
import { View } from "react-native";
import { Calendar as RNCalendar, LocaleConfig } from "react-native-calendars";

// Configuration de la localisation française
LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
};

LocaleConfig.defaultLocale = "fr";

interface CalendarProps {
  onDayPress: (date: string) => void;
  markedDates: { [key: string]: { marked: boolean } };
}

export const Calendar: React.FC<CalendarProps> = ({
  onDayPress,
  markedDates,
}) => {
  return (
    <View className="bg-white rounded-lg p-2.5 m-2.5 shadow-md">
      <RNCalendar
        onDayPress={(day: { dateString: string }) => onDayPress(day.dateString)}
        markedDates={markedDates}
        theme={{
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#007AFF",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          dotColor: "#00adf5",
          selectedDotColor: "#ffffff",
          arrowColor: "#00adf5",
          monthTextColor: "#00adf5",
          indicatorColor: "#00adf5",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
          textMonthFontWeight: "bold",
          textDayFontFamily: "System",
          textMonthFontFamily: "System",
          textDayHeaderFontFamily: "System",
        }}
        firstDay={1}
        enableSwipeMonths={true}
        locale="fr"
      />
    </View>
  );
};
