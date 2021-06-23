import React, { useState, useEffect } from 'react';
import {View, StyleSheet, TextInput, Platform, Button, Text, ScrollView} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomIonicon from './CustomIonicon';

const Search = props => {
    const [search, setSearch] = useState('');                             //state variable to store the input for searching
    const [pets, setPets] = useState([]);                                 //state variable to store the desired data fetched from API
    const [page, setPage] = useState(1);                                  //state variable to store current page number
    const [pageSort, setPageSort] = useState(1);
    const [pageSearch, setPageSearch] = useState(1);
    const [searchPress, setSearchPress] = useState(false);                //boolean state variable that is set when search button is pressed
    const [sortPress, setSortPress] = useState(false);                    //boolean state variable that is set when sort button is pressed
    const fetchedPets = [];
    let currentPage, currentPageSort, currentPageSearch, sorting;

    useEffect(() => {
        getData();
    }, [getData]);

    //function to fetch data from given API
    const apiFetch = async (apiURL) => {
        const response = await fetch(apiURL);
        const resData = await response.json();
        for (const key in resData) {
            fetchedPets.push(resData[key]);
          }
        setPets(fetchedPets);
    };

    //function to get unfiltered data from API in chunks of 10
    const getData = () => {
        apiFetch('https://60d075407de0b20017108b89.mockapi.io/api/v1/animals?page=1&limit=10');
    };

    const getDataNext = async () => {
        currentPage = page + 1;
        setPage(currentPage);
        apiFetch(`https://60d075407de0b20017108b89.mockapi.io/api/v1/animals?page=${currentPage}&limit=10`);
    };

    const getDataPrev = async () => {
        currentPage = page - 1;
        setPage(currentPage);
        apiFetch(`https://60d075407de0b20017108b89.mockapi.io/api/v1/animals?page=${currentPage}&limit=10`);
    };

    //function to get search results on input of user
    const searchPet = async () => {
        if(search){
            setSearchPress(true);
	    setPageSearch(1);
            apiFetch(`https://60d075407de0b20017108b89.mockapi.io/api/v1/animals?search=${search}&page=1&limit=10`);
        }
    };

    const searchPetNext = async () => {
        currentPageSearch = pageSearch + 1;
        setPageSearch(currentPageSearch);
        if(search){
            apiFetch(`https://60d075407de0b20017108b89.mockapi.io/api/v1/animals?search=${search}&page=${currentPageSearch}&limit=10`);
        }
    };

    const searchPetPrev = async () => {
        currentPageSearch = pageSearch - 1;
        setPageSearch(currentPageSearch);
        if(search){
            apiFetch(`https://60d075407de0b20017108b89.mockapi.io/api/v1/animals?search=${search}&page=${currentPageSearch}&limit=10`);
        }
    };

    //function to sort the fetched data according to user's choice
    const sortAge = () => {
	setPageSort(1);
        sorting = 'bornAt';
        sortPets();
    }

    const sortName = () => {
	setPageSort(1);
        sorting = 'name';
        sortPets();
    }

    const sortPets = async () => {
        setSortPress(true);
        apiFetch(`https://60d075407de0b20017108b89.mockapi.io/api/v1/animals?sortBy=${sorting}&page=1&limit=10`);
    };

    const sortPetsNext = async () => {
        currentPageSort = pageSort + 1;
        setPageSort(currentPageSort);
        apiFetch(`https://60d075407de0b20017108b89.mockapi.io/api/v1/animals?sortBy=${sorting}&page=${currentPageSort}&limit=10`);
    };

    const sortPetsPrev = async () => {
        currentPageSort = pageSort - 1;
        setPageSort(currentPageSort);
        apiFetch(`https://60d075407de0b20017108b89.mockapi.io/api/v1/animals?sortBy=${sorting}&page=${currentPageSort}&limit=10`);
    };

    //The UI of the screen that is rendered
	return(
        <View>
            {/* The search bar */}
            <View style={styles.search}>
                <TextInput style={styles.searchBox} placeholder="Search pets" onChangeText={text => setSearch(text)} />
                <HeaderButtons HeaderButtonComponent={CustomIonicon}>
                <Item
                    title="Search"
                    iconName={Platform.OS === 'android' ? 'md-search' : 'ios-search'}
                    onPress={searchPet}
                />
                </HeaderButtons>
            </View>
        
        {/*  Menu bar for sorting options */}
        {!searchPress && 
            <View style={styles.filter}>
                <Text style={{fontSize: 16, marginLeft: 5, fontWeight: 'bold'}}>Sort By : </Text>
                <Button title="Age" onPress={sortAge} />
                <Button title="Name" onPress={sortName} />
            </View>
        }

        {/*  Displaying fetched data */}
        <ScrollView style={styles.data}>
            {
                pets.map((pet) => {
                    var strToDate = new Date(pet.bornAt);
                    var age = Math.floor((new Date().getTime() - strToDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
                    return (
                        <View key={pet.id} style={{marginBottom: 15}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}> {pet.name} </Text>
                            <Text style={{marginLeft: 5, fontSize: 16}}>Age: {age} months</Text>
                        </View>
                    );
                })
            }
            {!searchPress && !sortPress &&
                <View style={styles.buttons}>
                    <Button title="previous" onPress={getDataPrev} disabled={page==1 ? true : false} />
                    <Button title="next" onPress={getDataNext} disabled={page==9 ? true : false} />
                </View>
            } 
            {sortPress && !searchPress &&
                <View style={styles.buttons}>
                    <Button title="previous" onPress={sortPetsPrev} disabled={pageSort==1 ? true : false} />
                    <Button title="next" onPress={sortPetsNext} disabled={pageSort==9 ? true : false} />
                </View>
            }   
            {searchPress && sortPress &&
                <View style={styles.buttons}>
                    <Button title="previous" onPress={searchPetPrev} disabled={pageSearch==1 ? true : false} />
                    <Button title="next" onPress={searchPetNext} disabled={pageSearch==2 ? true : false} />
                </View>
            }  
        </ScrollView>
      </View>
	);
};

//Styling of various components
const styles = StyleSheet.create({
    searchBox: {
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 10,
        marginLeft: 15,
        height: 35,
        paddingHorizontal:10,
        width: 330,
        borderRadius: 10
    },
    search: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginRight: 15
    },
    data: {
        marginTop: 15,
        marginLeft: 15
    },
    buttons:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginRight: 15
    },
    filter:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 20,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 5,
        borderRadius: 10
    }
});

export default Search;
