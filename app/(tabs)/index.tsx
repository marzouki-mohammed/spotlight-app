import { Link } from "expo-router";
import { Text, View } from "react-native";
import {styles} from "../../styles/auth.style"

export default function Index() {
  return (
    <View >
      <Text >Welcome</Text>
      <Link href="/notification" >View notification</Link>
    </View>
  );
}


