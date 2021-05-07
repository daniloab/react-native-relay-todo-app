import React, { useState } from 'react';
import {
    Alert,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import {
    List,
    Title,
    IconButton,
    Text as PaperText,
    Button as PaperButton,
    TextInput as PaperTextInput,
} from 'react-native-paper';
import { createFragmentContainer } from 'react-relay';
import CreateTodoMutation from './mutations/CreateTodoMutation';
import UpdateTodoMutation from './mutations/UpdateTodoMutation';
import DeleteTodoMutation from './mutations/DeleteTodoMutation';

import environment from '../../relay/environment';

const TodoList = (props) => {
    const [newTodoTitle, setNewTodoTitle] = useState('');

    const { query } = props;
    const { todos } = query;

    const createTodo = () => {
        const input = {
            fields: {
                title: newTodoTitle,
                done: false,
            },
        };

        CreateTodoMutation.commit({
            environment,
            input: input,
            onCompleted: () => {
                Alert.alert('Success!', 'Todo created!');
                setNewTodoTitle('')
            },
            onError: (errors) => {
                Alert.alert('Error!', errors[0].message);
            },
        });
    }

    const udpateTodo = (todoId, done) => {
        const input = {
            id: todoId,
            fields: {
                done,
            }
        }

        UpdateTodoMutation.commit({
            environment,
            input: input,
            onCompleted: () => {
                Alert.alert('Success!', 'Todo created!');
            },
            onError: (errors) => {
                Alert.alert('Error!', errors[0].message);
            },
        });
    }

    const deleteTodo = (todoId) => {
        const input = {
            id: todoId,
        }

        DeleteTodoMutation.commit({
            environment,
            input: input,
            onCompleted: () => {
                Alert.alert('Success!', 'Todo deleted!');
            },
            onError: (errors) => {
                console.log('errors', errors)
                // Alert.alert('Error!', errors[0].message);
            },
        });
    }

    const renderTodos = () => {
        if (!todos) {
            return null
        }

        return todos.edges.map(({ node: todo }) => (
            <List.Item
                key={todo.id}
                title={todo.title}
                titleStyle={
                    todo.done
                        ? Styles.todo_text_done
                        : Styles.todo_text
                }
                style={Styles.todo_item}
                right={props => (
                    <>
                        {!todo.done && (
                            <TouchableOpacity
                                onPress={() => udpateTodo(todo.id, true)}>
                                <List.Icon
                                    {...props}
                                    icon="check"
                                    color={'#4CAF50'}
                                />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                            <List.Icon {...props} icon="close" color={'#ef5350'} />
                        </TouchableOpacity>
                    </>
                )}
            />))
    }

    return (
        <>
            <StatusBar backgroundColor="#208AEC" />
            <SafeAreaView style={Styles.container}>
                <View style={Styles.header}>
                    <Image
                        style={Styles.header_logo}
                        source={{
                            uri:
                                'https://blog.back4app.com/wp-content/uploads/2019/05/back4app-white-logo-500px.png',
                        }}
                    />
                    <PaperText style={Styles.header_text_bold}>
                        {'React Native on Back4App'}
                    </PaperText>
                    <PaperText style={Styles.header_text}>{'Product Creation'}</PaperText>
                </View>
                <View style={Styles.wrapper}>
                    <View style={Styles.flex_between}>
                        <Title>Todo List</Title>
                        <IconButton
                            icon="refresh"
                            color={'#208AEC'}
                            size={24}
                        />
                    </View>
                </View>
                <View style={Styles.create_todo_container}>
                    {/* Todo create text input */}
                    <PaperTextInput
                        value={newTodoTitle}
                        onChangeText={text => setNewTodoTitle(text)}
                        label="New Todo"
                        mode="outlined"
                        style={Styles.create_todo_input}
                    />
                    {/* Todo create button */}
                    <PaperButton
                        onPress={() => createTodo()}
                        mode="contained"
                        icon="plus"
                        color={'#208AEC'}
                        style={Styles.create_todo_button}>
                        {'Add'}
                    </PaperButton>
                </View>
                <ScrollView>
                    {renderTodos()}
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const TodoListFragmentContainer = createFragmentContainer(TodoList, {
    query: graphql`
        fragment TodoList_query on Query {
            todos (first: 1000)
            @connection(key: "TodoList_todos", filters: []) {
                edges {
                    node {
                        id
                        title
                        done
                    }
                }
            }
        }
    `
})

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    wrapper: {
        width: '90%',
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: '#208AEC',
    },
    header_logo: {
        width: 170,
        height: 40,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    header_text_bold: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    header_text: {
        marginTop: 3,
        color: '#fff',
        fontSize: 14,
    },
    flex_between: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    create_todo_container: {
        flexDirection: 'row',
    },
    create_todo_input: {
        flex: 1,
        height: 38,
        marginBottom: 16,
        backgroundColor: '#FFF',
        fontSize: 14,
    },
    create_todo_button: {
        marginTop: 6,
        marginLeft: 15,
        height: 40,
    },
    todo_item: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.12)',
    },
    todo_text: {
        fontSize: 15,
    },
    todo_text_done: {
        color: 'rgba(0, 0, 0, 0.3)',
        fontSize: 15,
        textDecorationLine: 'line-through',
    },
});

export default TodoListFragmentContainer;
