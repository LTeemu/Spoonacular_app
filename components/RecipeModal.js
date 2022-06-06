import React, { useState } from 'react'
import { View, ScrollView, Linking, Image, Platform } from 'react-native'
import { styles } from '../styles'
import { Dimensions } from "react-native";
import Constants from 'expo-constants';
import { useTheme, Title, Text, Card, List } from 'react-native-paper';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import RenderHtml from 'react-native-render-html';
//Linkkien avaukseen
function openLink(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
}

const RecipeModal = ({ recipe }) => {
    const [expandedInstructions, setExpandedInstructions] = useState(false)
    const [expandedIngredients, setExpandedIngredients] = useState(false)
    const [expandedBreakdown, setExpandedBreakdown] = useState(false)
    const [expandedNutrition, setExpandedNutrition] = useState(false)
    const [expandedFlavonoids, setExpandedFlavonoids] = useState(false)
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const statusbarHeight = Constants.statusBarHeight;
    const theme = useTheme();
    const htmlSummary = { html: `<p>${recipe.summary}</p>` };
    const subtitle = <Text style={styles.text}><FA5 name={'clock'} size={styles.textSmall.fontSize} /> {recipe.readyInMinutes}m <Entypo name={'bowl'} size={styles.textSmall.fontSize} /> {recipe.servings}</Text>
    const tagsStyles = {
        p: {
            fontSize: styles.cardText.fontSize,
        }
    }

    return (
        <ScrollView style={{ height: screenHeight - 20 - statusbarHeight, width: screenWidth - 20, alignSelf: 'center', shadowRadius: 5, borderRadius: 5 }}>
            <Card style={{ backgroundColor: theme.colors.background, width: screenWidth - 20, minHeight: screenHeight - 20 - statusbarHeight }}>
                <Card.Cover source={{ uri: recipe.image }} style={styles.modalImg} />
                <Card.Title title={recipe.title} subtitle={subtitle} titleStyle={{ ...styles.modalTitle, color: theme.colors.card }} subtitleStyle={{ ...styles.text, padding: 5 }} />
                <Card.Content>
                    <RenderHtml source={htmlSummary} tagsStyles={tagsStyles} systemFonts={[...Constants.systemFonts, 'Jost']} baseStyle={{ fontFamily: 'Jost', fontWeight: '300' }} contentWidth={100} />
                    {/*  Ainesosat */}
                    {recipe.usedIngredients && recipe.missedIngredients ?
                        <List.Accordion
                            style={{ ...styles.accordion, borderBottomColor: expandedIngredients ? 'transparent' : 'rgba(0, 0, 0, 0.1)' }}
                            title="Ingredients"
                            titleStyle={{ ...styles.modalAccordionTitle, color: theme.colors.card }}
                            expanded={expandedIngredients}
                            onPress={() => setExpandedIngredients(!expandedIngredients)}
                        // right={props => <List.Icon {...props}  icon={expandedIngredients ? 'chevron-up' : 'chevron-down'} color={expandedIngredients ? '#DD5A67' : 'black'} style={{marginRight: -8, backgroundColor: expandedIngredients ? 'white' : 'transparent'}}/>}
                        >
                            <View style={styles.modalAccordionContainer}>
                                {/* Reseptissä käytetyt ainesosat */}
                                {recipe.usedIngredients.map(ingredient => (
                                    <View key={ingredient.id} style={styles.flexRow}>
                                        {/* <FA5 name={'check'} color={'#519155'} style={{ ...styles.cardText, marginRight: 5 }} /> */}
                                        <Text style={{ ...styles.text, textTransform: 'capitalize' }}>{ingredient.name}</Text>
                                        <Text style={{ ...styles.textSmall, color: 'gray', alignSelf: 'center' }}> {ingredient.amount} {ingredient.unit}</Text>
                                    </View>
                                ))}
                                {/* Puuttuvat ainesosat */}
                                {recipe.missedIngredients.map(ingredient => (
                                    <View key={ingredient.id} style={styles.flexRow}>
                                        {/* <FA5 name={'times'} color={'#99322e'} style={{ marginRight: 5, ...styles.cardText }} /> */}
                                        <Text style={{ ...styles.text, textTransform: 'capitalize' }}>{ingredient.name}</Text>
                                        <Text style={{ ...styles.textSmall, color: 'gray', alignSelf: 'center' }}> {ingredient.amount} {ingredient.unit}</Text>
                                    </View>
                                ))}
                            </View>
                        </List.Accordion>
                        : null}

                    {/* Ohjeet */}
                    {recipe.analyzedInstructions && recipe.analyzedInstructions[0] ?
                        <List.Accordion
                            style={{ ...styles.accordion, borderBottomColor: expandedInstructions ? 'transparent' : 'rgba(0, 0, 0, 0.1)' }}
                            title="Instructions"
                            titleStyle={{ ...styles.modalAccordionTitle, color: theme.colors.card }}
                            expanded={expandedInstructions}
                            onPress={() => setExpandedInstructions(!expandedInstructions)}
                        >
                            <View style={styles.modalAccordionContainer}>
                                {recipe.analyzedInstructions[0].steps.map(i =>
                                    <View key={i.number} style={{ ...styles.flexRow, paddingVertical: 5, borderTopWidth: i.number === 1 ? 0 : 2, borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                                        <Text style={styles.text}>{i.number + '. '}</Text>
                                        <Text style={{ ...styles.text, maxWidth: screenWidth - 80 }}>{i.step}</Text>
                                    </View>
                                )}
                            </View>
                        </List.Accordion>
                        : null
                    }

                    {/* Kalorit */}
                    {recipe.nutrition && recipe.nutrition.caloricBreakdown ?
                        <List.Accordion
                            style={{ ...styles.accordion, borderBottomColor: expandedBreakdown ? 'transparent' : 'lightgray' }}
                            title="Caloric breakdown"
                            titleStyle={{ ...styles.modalAccordionTitle, color: theme.colors.card }}
                            expanded={expandedBreakdown}
                            onPress={() => setExpandedBreakdown(!expandedBreakdown)}
                        >
                            <View style={styles.modalAccordionContainer}>
                                <Text style={{ ...styles.text, textTransform: 'capitalize' }}>Carbs {recipe.nutrition.caloricBreakdown.percentCarbs}%</Text>
                                <Text style={{ ...styles.text, textTransform: 'capitalize' }}>Fat {recipe.nutrition.caloricBreakdown.percentFat}%</Text>
                                <Text style={{ ...styles.text, textTransform: 'capitalize' }}>Protein {recipe.nutrition.caloricBreakdown.percentProtein}%</Text>
                            </View>
                        </List.Accordion>
                        : null
                    }

                    {/* Ravintoarvot */}
                    {recipe.nutrition && recipe.nutrition.nutrients ?
                        <List.Accordion
                            style={{ ...styles.accordion, borderBottomColor: expandedNutrition ? 'transparent' : 'rgba(0, 0, 0, 0.1)' }}
                            title="Nutrients"
                            titleStyle={{ ...styles.modalAccordionTitle, color: theme.colors.card }}
                            expanded={expandedNutrition}
                            onPress={() => setExpandedNutrition(!expandedNutrition)}
                        >
                            <View style={styles.modalAccordionContainer}>
                                {recipe.nutrition.nutrients.map(nutrient => (
                                    nutrient.amount > 0
                                        ? <View key={nutrient.name} style={{ ...styles.flexRow, justifyContent: 'space-between' }}>
                                            <Text style={{ ...styles.text, textTransform: 'capitalize' }}>{nutrient.name} {nutrient.amount} {nutrient.unit}</Text>
                                            <Text style={styles.text}>{nutrient.percentOfDailyNeeds}%</Text>
                                        </View>
                                        : null
                                ))}
                                <View style={{ width: '100%' }}>
                                    <Text style={{ alignSelf: 'flex-end', color: 'darkgray', fontFamily: 'Jost' }}>% Of Daily Needs</Text>
                                </View>
                            </View>
                        </List.Accordion>
                        : null
                    }

                    {/* Flavonoidit */}
                    {recipe.nutrition && recipe.nutrition.flavonoids ?
                        <List.Accordion
                            style={{ ...styles.accordion, borderBottomColor: expandedFlavonoids ? 'transparent' : 'lightgray' }}
                            title="Flavonoids"
                            titleStyle={{ ...styles.modalAccordionTitle, color: theme.colors.card }}
                            expanded={expandedFlavonoids}
                            onPress={() => setExpandedFlavonoids(!expandedFlavonoids)}
                        >
                            <View style={styles.modalAccordionContainer}>
                                {recipe.nutrition.flavonoids.map(flavonoid => (
                                    flavonoid.amount > 0
                                        ? <Text key={flavonoid.name} style={{ ...styles.text, textTransform: 'capitalize' }}>{flavonoid.name} {flavonoid.amount} {flavonoid.unit}</Text>
                                        : null
                                ))}
                            </View>
                        </List.Accordion>
                        : null
                    }

                    <Text onPress={() => openLink(recipe.sourceUrl)} style={{ ...styles.text, color: 'rgb(36, 93, 193)', marginVertical: 10, textAlign: 'right', marginRight: 10, }}>
                        Source: {recipe.sourceName}
                    </Text>
                </Card.Content>
            </Card>
        </ScrollView >
    )
}

export default RecipeModal