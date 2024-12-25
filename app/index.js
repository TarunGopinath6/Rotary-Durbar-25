import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  Platform,
  Linking,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// import { StatusBar } from "react-native";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    // Set timeout for long response times
    const timeout = setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Timeout",
        "The authentication process is taking too long. Please try again."
      );
    }, 30000); // 30 seconds

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user);
      clearTimeout(timeout); // Clear timeout if request completes in time
      const userRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists() === true) {
        router.push("/protected");
      } else {
        Alert.alert("Error", "User is inactive or disabled.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      let errorMessage = "An error occurred. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }
      Alert.alert("Login Error", errorMessage);
    } finally {
      clearTimeout(timeout); // Ensure timeout is cleared
      setIsLoading(false);
    }
  };

  const openWhatsApp = async () => {
    console.log("Support Pressed");
    const phoneNumber = "7358543242";
    const cleanNumber = phoneNumber.replace(/[^\d]/g, "");
    const whatsappUrl = Platform.select({
      ios: `whatsapp://send?phone=${cleanNumber}`,
      android: `whatsapp://send?phone=${cleanNumber}`,
    });

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        const storeUrl = Platform.select({
          ios: `https://apps.apple.com/app/whatsapp-messenger/id310633997`,
          android: `market://details?id=com.whatsapp`,
        });
        await Linking.openURL(storeUrl);
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor="#FFFFF0"
        barStyle="dark-content"
        translucent={false}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View
            style={{
              flex: 1,
              maxHeight: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../assets/images/adaptive-icon.png")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.title}>Sign in</Text>

          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>Having trouble signing in? </Text>
            <TouchableOpacity onPress={openWhatsApp}>
              <Text style={styles.loginLink}>Support</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#666"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFF0" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.socialButton,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  paddingHorizontal: 15,
                },
              ]}
            >
              <Image
                source={{ uri: "https://www.google.com/favicon.ico" }}
                style={[
                  styles.socialIcon,
                  {
                    width: 30,
                    height: 30,
                    objectFit: "contain",
                    marginRight: 20,
                  },
                ]}
              />
              <Text style={{ textAlign: "center" }}>Sign in with Google</Text>
            </TouchableOpacity>
          </View> */}

          <Text style={styles.termsText}>
            By clicking Continue you agree to the {"\n"}
            <Text style={styles.termsLink}>Terms of use</Text> and{" "}
            <Text style={styles.termsLink}>Privacy policy</Text>
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: "100%",
    maxWidth: 150,
    maxHeight: 150,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFF0", // Ivory white from your palette
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  loginPrompt: {
    flexDirection: "row",
    marginBottom: 32,
  },
  promptText: {
    color: "#666",
  },
  loginLink: {
    color: "#A32638", // Navy blue from your palette
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    height: 48,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  recoveryLink: {
    color: "#666",
    textAlign: "right",
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: "#A32638", // Navy blue from your palette
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  continueButtonText: {
    color: "#FFFFF0", // Ivory white from your palette
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  dividerText: {
    color: "#666",
    paddingHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    // width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  termsText: {
    textAlign: "center",
    color: "#666",
    lineHeight: 20,
  },
  termsLink: {
    color: "#17458F", // Navy blue from your palette
  },
});
