import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/core';

import { Author, BidCard, LargeButton, Likes, SquareButton, Tag, Text } from '@nft/components';
import { colors, fontsFamily, fontsSize } from '@nft/styles';
import PlaceABid from '@nft/screens/ModalPlaceABid';
import ConnectWallet from '@nft/screens/ConnectWallet';

import Ether from '../../../assets/ether.svg';
import EtherBlack from '../../../assets/ether-black.svg';
import EtherBlackSmall from '../../../assets/ether-black-small.svg';
import Back from '../../../assets/left-arrow.svg';

import { AlignTypes } from '@nft/utils/enum';
import styles from './styles';
import { api } from '@nft/services/api';
import { Alert } from 'react-native';
import { useModal } from '@nft/context/modal.context';
import { useWallet } from '@nft/context/wallet';
import { useAuth } from '@nft/context/auth';

interface INFTDescriptionResponse {
  nft: {
    author: {
      id: number;
      address: string;
      name: string;
      description: string;
      profilePicture: string;
    };
    description: string;
    favorite: boolean;
    favorite_count: number;
    id: number;
    image: string;
    last_bid: number;
    name: string;
    tags: string;
    value: number;
  };
  success: boolean;
}

const DescriptionNft = (): JSX.Element => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nftDescriptionResponse, setNftDescriptionResponse] = useState(
    {} as INFTDescriptionResponse,
  );

  const { user } = useAuth();

  const navigation = useNavigation();
  const { params } = useRoute();
  const user_id = user.id;

  const { openModal } = useModal();

  const { wallet } = useWallet();

  useEffect(() => {
    user.id ? setIsWalletConnected(true) : setIsWalletConnected(false);
  }, [wallet]);

  const handleLikeImage = async (id: number) => {
    if (!user.id) {
      openModal();
      return;
    }
    const request = {
      nft_id: id,
      user_id,
    };

    await api
      .put('nft/favorite', request)
      .then((response) => {
        const isLike = response.data.message.includes('adicionar');

        let nftLiked = Object.assign({}, nftDescriptionResponse);
        if (isLike) {
          nftLiked.nft.favorite_count++;
          nftLiked.nft.favorite = true;
        } else {
          nftLiked.nft.favorite_count--;
          nftLiked.nft.favorite = false;
        }
        setNftDescriptionResponse(nftLiked);
      })
      .catch((error) => {
        Alert.alert('Ops! There was a problem', 'Please try again later.');
      });
  };

  useEffect(() => {
    const fetchNftDescription = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/nft/details/${params}/${user_id}`);
        setNftDescriptionResponse(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    fetchNftDescription();
  }, [params]);

  const tagsSplited = nftDescriptionResponse.nft?.tags.split('|');

  return (
    <>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <SafeAreaView style={styles.container}>
          {isWalletConnected ? <PlaceABid /> : <ConnectWallet />}

          <View style={styles.head}>
            <SquareButton iconChildren={Back} onPress={() => navigation.goBack()} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            <View>
              <Image
                source={{
                  uri: nftDescriptionResponse.nft?.image,
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailsHeader}>
                <Text
                  textDescription={nftDescriptionResponse.nft?.name}
                  color={colors.light.neutralColor3}
                  fontFamily={fontsFamily.montserrat.semiBold600}
                  fontsSize={fontsSize.lg18}
                />

                <View style={styles.containerTagsLike}>
                  {tagsSplited ? (
                    tagsSplited.map((item) => (
                      <Tag label={item} key={item} borderColor={colors.light.neutralColor5} />
                    ))
                  ) : (
                    <></>
                  )}

                  {/* TODO implementar a função de like e deslike */}
                  <View style={styles.likes}>
                    <Likes
                      numberOfLikes={nftDescriptionResponse.nft?.favorite_count}
                      likeFunction={() => {
                        handleLikeImage(nftDescriptionResponse.nft.id);
                      }}
                      isLiked={nftDescriptionResponse.nft?.favorite}
                      textAlign={AlignTypes.CENTER}
                      textColor={colors.light.neutralColor5}
                      textFontFamily={fontsFamily.montserrat.regular400}
                      textFontSize={fontsSize.xs12}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.author}>
                <Author
                  authorImage={{
                    uri: nftDescriptionResponse.nft?.author.profilePicture,
                  }}
                  authorName={nftDescriptionResponse.nft?.author.name}
                />
              </View>
              <View style={styles.description}>
                <Text
                  textDescription={nftDescriptionResponse.nft?.description}
                  color={colors.light.neutralColor3}
                  fontFamily={fontsFamily.montserrat.regular400}
                  fontsSize={fontsSize.sm14}
                />
              </View>
              <View style={styles.detailsFooter}>
                <BidCard
                  currency={'ETH'}
                  smallIconChildren={EtherBlackSmall}
                  largeIconChildren={EtherBlack}
                  value={nftDescriptionResponse.nft?.last_bid}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <LargeButton
                backgroundColor={colors.light.neutralColor5}
                label={'Place a bid'}
                textAlign={AlignTypes.CENTER}
                textColor={colors.light.neutralColor12}
                textFontFamily={fontsFamily.montserrat.semiBold600}
                textFontSize={fontsSize.md16}
                iconChildren={Ether}
                onPress={openModal}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default DescriptionNft;
