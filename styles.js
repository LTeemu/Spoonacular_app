import { Dimensions, Platform } from "react-native";
import StyleSheet from 'react-native-media-query';
import Constants from 'expo-constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const statusbarHeight = Constants.statusBarHeight;

const fontSizeTest = ((screenHeight < 1500 && screenWidth < 1500) && (screenWidth > 700 || screenHeight > 700))
    ? screenHeight > screenWidth ? RFValue(screenHeight / 55, screenHeight) : RFValue(screenWidth / 50, screenWidth)
    : (screenWidth > 1500 || screenHeight > 1500) ? 25 : 13;

const fonts = {
    small: 'Jost',
    normal: 'Jost',
    title: 'Jost',
    headerTitle: 'Lobster',
}

export const { ids, styles } = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    scrollTopBtn: {
        position: 'absolute',
        bottom: 0,
        right: Platform.OS === 'android' ? 0 : 15,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.66)',
        borderRadius: 5,
    },
    recipeListContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 8,
    },
    ingredientBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    text: {
        fontSize: fontSizeTest,
        fontFamily: fonts.normal,
        fontWeight: '300',
    },
    textSmall: {
        fontSize: fontSizeTest*0.85,
        fontFamily: fonts.normal,
        fontWeight: '400'
    },
    btnText: {
        fontSize: fontSizeTest,
        fontFamily: fonts.normal,
        fontWeight: '500',
    },
    ingredientBtn: {
        marginBottom: 8,
        marginHorizontal: 2.5,
        paddingLeft: 5,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
    inputBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 6,
        height: 40,
        width: '100%',
    },
    addBtnContainer: {
        width: '20%',
        height: 40,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
    addBtn: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    textInputContainer: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
    textInput: {
        height: '100%',
        width: '100%',
        paddingLeft: 5,
        fontSize: fontSizeTest,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        backgroundColor: 'white'
    },
    scrollContent: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    recipeContainer: {
        borderWidth: 1,
        borderRadius: 10,
        '@media (min-width: 2001px)': {
            //width: (100 * (1 - ((margin*2) * boxiMäärä) / 100)) / boxiMäärä) + '%',
            width: (100 * (1 - ((0.8 * 7) / 100)) / 7) + '%',
            margin: '0.4%'
        },
        '@media (min-width: 1601px) and (max-width: 2000px)': {
            width: (100 * (1 - ((1 * 6) / 100)) / 6) + '%',
            margin: '0.5%'
        },
        '@media (min-width: 1201px) and (max-width: 1600px)': {
            width: (100 * (1 - ((1.2 * 5) / 100)) / 5) + '%',
            margin: '0.6%'
        },
        '@media (min-width: 991px) and (max-width: 1200px)': {
            width: (100 * (1 - ((1.4 * 4) / 100)) / 4) + '%',
            margin: '0.7%'
        },
        '@media (min-width: 769px) and (max-width: 990px)': {
            width: (100 * (1 - ((1.6 * 3) / 100)) / 3) + '%',
            margin: '0.8%'
        },
        '@media (min-width: 401px) and (max-width: 768px)': {
            width: (100 * (1 - ((1.8 * 2) / 100)) / 2) + '%',
            margin: '0.9%',
        },
        '@media (max-width: 400px)': {
            width: '100%',
            marginVertical: 5,
        },
    },
    recipeImage: {
        height: 150,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        resizeMode: 'cover'
    },
    modalBtn: {
        position: 'absolute',
        top: 0 - statusbarHeight,
        right: Platform.OS === 'android' ? 10 : 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 0,
        height: 40,
        width: 40,
        marginTop: statusbarHeight,
    },
    modalImg: {
        width: '100%',
        maxWidth: 280,
        alignSelf: 'center',
        resizeMode: 'contain',
        borderRadius: 5,
        marginTop: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'darkgray'
    },
    searchContainer: {
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    filterBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        height: 40,
        zIndex: 1,
        marginTop: 5,
    },
    dropdown: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 40,
        backgroundColor: 'white',
        borderColor: 'rgba(0, 0, 0, 0.25)',
        borderWidth: 1,
        alignItems: 'center',
        paddingHorizontal: 5,
        borderRadius: 0,
    },
    drawerBtn: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.15)',
    },
    dropdownText: {
        display: 'flex',
        flexDirection: 'row',
        fontSize: fontSizeTest,
        fontFamily: fonts.normal,
    },
    modalTitle: {
        fontSize: fontSizeTest*1.3,
        fontFamily: fonts.title,
        fontWeight: '700',
        paddingVertical: 5,
    },
    modalAccordionTitle: {
        fontSize: fontSizeTest*1.2,
        fontFamily: fonts.title,
        fontWeight: '600',
        marginHorizontal: -8,
        padding: 5,
    },
    modalAccordionContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        padding: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderTopColor: 'transparent'
    },
    accordion: {
        marginHorizontal: 0,
        padding: 0,
        borderBottomWidth: 1,
    },
    cardTitle: {
        fontSize: fontSizeTest,
        fontFamily: fonts.title,
        fontWeight: '600',
        color: '#F3EAE3',
    },
    cardText: {
        fontSize: fontSizeTest*0.9,
        fontFamily: fonts.normal,
        fontWeight: '400'
    },
    headerTitle: {
        fontSize: fontSizeTest * 1.6,
        fontFamily: fonts.headerTitle,
        color: '#F3EAE3',
    },
    dropdownContainer: {
        elevation: 1,
    },
    dropdownSelectedItemContainer: {
        display: 'flex',
        flexDirection: 'row',       
    },
    dropdownTick: {
        marginVertical: 'auto',
        display: 'none',
    },
    dropdownModalTitle: {
        fontWeight: '600',
    },
    getRecipesBtn: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
    favoriteIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    logincontainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logininputView: {
        borderRadius: 6,
        width: "80%",
        marginBottom: 10,
        alignItems: "center",
    },
    loginTextInput: {
        width: '100%',
        fontFamily: 'Jost',
        fontSize: fontSizeTest,
    },
    loginBtn: {
        width: "80%",
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        borderColor: 'rgba(0, 0, 0, 0.25)',
        borderWidth: 1,
    },
    registerBtn: {
        width: "80%",
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        borderColor: 'rgba(0, 0, 0, 0.25)',
        borderWidth: 1,
    },
        //// Notes ////
        notesContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        notesCardArea: {
            // height: 312,
            flex: 1,
            justifyContent: 'center',
            // paddingLeft: 32,
            marginVertical: 18
        },
        noteCards: {
            borderRadius: 12,
            marginHorizontal: 12,
            width: screenWidth - 140,
            // maxHeight: screenHeight * 325,
            // backgroundColor: '#CC444B',
            marginVertical: 5,
            alignSelf: 'center',
        },
        noteRemove: {
            fontSize: fontSizeTest * 1.8,
            color: '#fff',
        },
        forMore: {
            fontFamily: fonts.small,
            fontSize: fontSizeTest * 0.8,
            color: '#FFF',
            paddingTop: 6,
            marginRight: 6
        },
        noteCardDate: {
            fontFamily: fonts.small,
            fontSize: fontSizeTest, 
            color: '#fff', 
            alignSelf: 'center', 
            fontWeight: 'bold', 
            marginBottom: 12
        },
        noteCardTitle: {
            fontFamily: fonts.title,
            fontSize: fontSizeTest * 1.8,
            color: '#FFF',
            paddingVertical: 5,
            paddingHorizontal: 5,
        },
        noteCardTxt: {
            fontFamily: fonts.normal,
            fontSize: fontSizeTest,
            color: '#FFF',
            paddingBottom: 5,
            marginBottom: 12,
            paddingVertical: 5,
            paddingHorizontal: 5,
        },
        noteCardCounter: {
            fontFamily: fonts.headerTitle,
            fontSize: fontSizeTest * 5,
            paddingHorizontal: 2,
            color: '#FFF',
            alignSelf: 'center',
        },
        noteCardCounterTitle: {
            fontFamily: fonts.small,
            fontSize: fontSizeTest * 1.4,
            color: '#FFF',
            alignSelf: 'center',
            paddingTop: 24,
        },
        notesBtns: {
            flexDirection: 'row',
            marginTop: 10,
        },
        notesBtnTxt: {
            fontSize: fontSizeTest,
            fontFamily: fonts.small,
            paddingTop: 4
        },
        notesDivider: {
            flex: 1,
            height: 1,
            backgroundColor: '#CC444B',
            alignSelf: 'center',
        },
        notesBtn: {
            padding: 12,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
        },
        notesIcon: {
            padding: 12,
            borderWidth: 1,
            borderRadius: 5,
            fontSize: 26,
            borderStyle: 'dashed',
            borderColor: '#CC444B',
            color: '#CC444B',
        },
        noteModal: {
            height: screenHeight - 20 - statusbarHeight,
            width: screenWidth - 20,
            alignSelf: 'center',
            shadowRadius: 5,
            borderRadius: 5,
            justifyContent: 'center',
        },
        noteLabel: {
            fontSize: fontSizeTest * 2,
            fontFamily: fonts.headerTitle,
            paddingVertical: 12,
            alignSelf: 'center',
            paddingHorizontal: 6,
        },
        noteInput: {
            height: 36,
            padding:6,
            borderBottomWidth: 2,
            width: '100%',
            alignSelf: 'center',
        },
        DetailPageInfo: {
            paddingHorizontal: 6,
        },
        listArea: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        DetailPageTxt: {
            lineHeight: 24,
            paddingVertical: 12,
            paddingHorizontal: 5,
        },
        itemTxt: {
            fontSize: fontSizeTest * 1.2,
            fontFamily: fonts.normal,
            paddingVertical: 12,
            alignSelf: 'center',
            paddingHorizontal: 6,
        },
        itemNumber: {
            fontSize: fontSizeTest * 2,
            fontFamily: fonts.headerTitle,
        },
        listInput: {
            padding: 6,
            borderColor: '#CC444B',
            borderBottomWidth: 1,
            width: '100%'
        },
        listAddBtn: {
            height: 50,
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor:  '#CC444B',
            borderRadius: 6,
        },
});
