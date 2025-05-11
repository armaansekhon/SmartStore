import React, { useRef } from 'react';
import { StyleSheet,Keyboard ,TouchableWithoutFeedback,KeyboardAvoidingView, Text, View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

const Forget = () => {
  const Router = useRouter();
 

 
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      style={styles.kview}
     
    >
    <View style={styles.container}>
      <View style={styles.logoPlaceholder}>
        <Text style={styles.logoText}>LOGO HERE</Text>
      </View>

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Don't  want to change?<TouchableOpacity  onPress={() => Router.back()}><Text style={{color:"#3367B1",marginLeft:10, top:4,}}>Go Back</Text></TouchableOpacity> </Text>

      <Text style={styles.label}>Email ID</Text>
              <TextInput
                placeholder="Enter email"
              
                style={styles.input}
                placeholderTextColor="#aaa"
              />
      <TouchableOpacity
          style={{ width:'100%' , alignSelf:"center"}}
          onPress={() => Router.push('Reset')}
        >
          <LinearGradient
            colors={['#3367B1', '#9285BF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>CONFIRM</Text>
          </LinearGradient>
        </TouchableOpacity>


    </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({

    kview:{
        flex:1,
        backgroundColor:"#fff",
        padding:10,
      },
  container: {
    flex: 1,
    height:"100%",
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
   paddingBottom:180,
    alignItems:"baseline",
   
  },
  logoPlaceholder: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#808080',
    marginBottom: 30,
    textAlign: 'left',
  },
  
  
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 80,
    marginBottom: 20,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    width:"100%",
    borderColor: '#D9D9D9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 30,
    fontSize: 16,
    color: '#000',
  },
});

export default Forget;
