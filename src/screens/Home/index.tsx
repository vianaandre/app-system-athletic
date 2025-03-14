import React, { useEffect } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";


export function Home() {
  const title = "Gerenciador";

  const navigation = useNavigation();

  useEffect(() => {
      navigation.navigate("Login")
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.sideLeft}>
          <View style={styles.titleContainer}>
            {title.split('').map((letter, index) => (
              <Text key={index} style={styles.sidebarText}>
                {letter}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.sideRight}>
          <Image
            source={require("../../assets/img/logo-init.png")}
            style={styles.image}
          />
          <View style={styles.containerText}>
            <Text style={styles.centerText}>Atlética</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}