
 import React, {useContext, useState, useEffect} from 'react';
 import {
   View,
   Text,
   SafeAreaView,
   ScrollView,
   TouchableOpacity,
   TextInput,
   Button,
   ImageBackground,
   Modal,
 } from 'react-native';
 import {AuthContext} from '../../navigation/AuthProvider';
 import firestore from '@react-native-firebase/firestore';
 import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
 import storage from '@react-native-firebase/storage';
 import Loading from '../../utils/Loading';
 import Icon from 'react-native-vector-icons/FontAwesome5';
 import IconAD from 'react-native-vector-icons/AntDesign';
 import {ActivityIndicator} from 'react-native-paper';
 

 const ProfilScreen = () => {
   const [isLoading, setIsloading] = useState(false);
   const [isUploading, setIsUploading] = useState(false);
   const [downloadURL, setDownloadURL] = useState();
   const [uploadTask, setUploadTask] = useState();
   const [uploadTaskSnapshot, setUploadTaskSnapshot] = useState({});
   const {signout, user} = useContext(AuthContext);
   const [currentUser, setCurrentUser] = useState({});
   const [currentUserName, setCurrentUserName] = useState('');
   const usersColl = firestore().collection('users');
   const [showModal, setShowModal] = useState(false);

    // Kullanıcının adını Firestore'dan al
  useEffect(() => {
    const getUserData = async () => {
      setIsloading(true);
      const userDoc = await firestore().collection('Users').doc(user.uid).get();
      if (userDoc.exists) {
        setCurrentUser(userDoc.data());
        setCurrentUserName(userDoc.data().Name);
      }
      setIsloading(false);
    };

    getUserData();
  }, [user.uid]); // user.uid değiştiğinde useEffect'i tekrar çalıştır

  //  const onTakePhoto = async () => {
  //    await launchCamera({mediaType: 'photo', saveToPhotos: true}, onMediaSelect);
  //  };


  const updateCurrentUser = async () => {
    if (!user || !user.uid) {
      console.error("Kullanıcı oturumu açık değil veya UID mevcut değil.");
      return;
    }
  
    try {
      setIsloading(true);
    
      // Firestore'da kullanıcı adını güncelle
      await firestore().collection('Users').doc(user.uid).update({
        Name: currentUserName,
      });
    
      // Firebase Authentication'da kullanıcı adını güncelle
      await user.updateProfile({
        displayName: currentUserName,
      });
    
      // Kullanıcı bilgilerini yeniden çek
      await getCurrentUser();
    } catch (error) {
      console.error("Kullanıcı güncelleme hatası:", error);
    } finally {
      setIsloading(false);
    }
  };
  const getCurrentUser = async () => {
  try {
    // Kullanıcının oturum açtığından emin olun
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.error("Kullanıcı oturumu açık değil.");
      return;
    }

    // Firestore'dan kullanıcının bilgilerini çek
    const userDoc = await firestore().collection('Users').doc(currentUser.uid).get();
    if (userDoc.exists) {
      // Kullanıcının bilgilerini state'lere atayın
      setCurrentUser(userDoc.data());
      setCurrentUserName(userDoc.data().Name);
    } else {
      console.error("Kullanıcı dökümanı mevcut değil.");
    }
  } catch (error) {
    console.error("Kullanıcı bilgilerini çekerken hata oluştu:", error);
  }
};



  // const updateCurrentUser = async () => {
  //   try {
  //     setIsloading(true);
  
  //     await usersColl.doc(user.uid).update({
  //       Name: currentUserName,
  //     });
  
  //     await user.updateProfile({
  //       displayName: currentUserName,
  //     });
  
  //     getCurrentUser();
  //   } catch (error) {
  //     console.error("Kullanıcı güncelleme hatası:", error);
  //   } finally {
  //     setIsloading(false);
  //   }
  // };
  //  const updateCurrentUser = async () => {
  //    setIsloading(true);

  //    await usersColl.doc(User.uid).update({
  //      Name: currentUserName,
  //    });

  //    await User.updateProfile({
  //      displayName: currentUserName,
  //    });
  //    getCurrentUser();
  //    setIsloading(false);
  //  };

 

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      {isLoading ? (
        <Loading />
      ) : (
        <View
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={showModal}
            onRequestClose={() => {
              alert('Güle Güle!');
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#eee',
                padding: 10,
                margin: 20,
              }}>
              

               
               <TouchableOpacity
               // onPress={onSelectImagePress}
                style={{
                  marginBottom: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: '#000',
                  width: '80%',
                }}> 
                <Text style={{fontSize: 20}}>Kütüphaneden Seç</Text>
              </TouchableOpacity>

              {isUploading && (
                <View
                  style={{
                    marginTop: 50,
                    marginBottom: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size={50} color="#f00" />
                  <Text style={{fontSize: 20, margin: 20}}>Uploading</Text>
                  <Text style={{fontSize: 20, margin: 20}}>
                    {(
                      (uploadTaskSnapshot.bytesTransferred /
                        uploadTaskSnapshot.totalBytes) *
                      100
                    ).toFixed(2) + '% / 100%'}
                  </Text>
                </View>
              )}

              <Button onPress={() => setShowModal(!showModal)} title="Kapat" />
            </View>
          </Modal>

          <TouchableOpacity
            onPress={() => setShowModal(!showModal)}
            style={{
              width: 100,
              height: 100,
              borderRadius: 40,
              margin: 10,
            }}>
            
          </TouchableOpacity> 

          <Text style={{fontSize: 24}}>{currentUser.Name}</Text>

          <TextInput
            name="name"
            placeholder="Adınız"
            style={{
              height: 50,
              width: '90%',
              padding: 10,
              margin: 10,
              borderColor: '#000',
              borderWidth: 1,
              borderRadius: 10,
              fontSize: 16,
            }}
            onChangeText={value => setCurrentUserName(value)}
            value={currentUserName}
          />

          <TouchableOpacity
                onPress={updateCurrentUser}
                style={{
                  marginBottom: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: '#000',
                  width: '80%',
                }}>
                <Text style={{fontSize: 20}}>Güncelle</Text>
              </TouchableOpacity>
          <TouchableOpacity
                onPress={signout}
                style={{
                  marginBottom: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  borderRadius: 30,
                  borderWidth: 1,
                   borderColor: '#000',
                   width: '80%',
                 }}>
                 <Text style={{fontSize: 20}}>Çıkış</Text>
               </TouchableOpacity>
           <TouchableOpacity
             onPress={signout}
             style={{
               position: 'absolute',
               top: 30,
               right: 30,

               alignItems: 'center',
               justifyContent: 'center',
             }}>
            {/* <IconAD name="logout" size={32} color="#f00" /> */}
           </TouchableOpacity>
         </View>
       )}
     </SafeAreaView>
   );
 };

 export default ProfilScreen;
