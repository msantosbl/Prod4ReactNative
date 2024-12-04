import React, { useEffect, useState, useRef } from 'react';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';

// Inicializar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA0UTbAvRWCheukNzm4-DUWXHKlE2X2q2k",
    authDomain: "frontcraft-36a90.firebaseapp.com",
    projectId: "frontcraft-36a90",
    storageBucket: "frontcraft-36a90.firebasestorage.app",
    messagingSenderId: "861086747402",
    appId: "1:861086747402:web:a4acc427cce718ebb708f3"
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export const PlayersComponent: React.FC = () => {
    const [players, setPlayers] = useState<any[]>([]);
    const [filterTerm, setFilterTerm] = useState('');
    const [filterAge, setFilterAge] = useState<number | null>(null);
    const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);
    const [editedPlayer, setEditedPlayer] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newPlayer, setNewPlayer] = useState({
        id: '',
        name: '',
        ppg: null,
        rpg: null,
        apg: null,
        height: '',
        weight: '',
        age: null,
        image: '',
    });

    // Fetch jugadores de Firebase
    useEffect(() => {
        const fetchPlayers = async () => {
            const playersCollection = collection(firestore, 'jugadores');
            const snapshot = await getDocs(playersCollection);
            const playersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setPlayers(playersData);
            setFilteredPlayers(playersData);
        };

        fetchPlayers();
    }, []);

    // Filtrar jugadores
    const filterPlayers = () => {
        const filtered = players.filter(player => {
            const matchesName = player.name.toLowerCase().includes(filterTerm.toLowerCase());
            const matchesAge = filterAge === null || player.age === filterAge;
            return matchesName && matchesAge;
        });
        setFilteredPlayers(filtered);
    };

    // Añadir jugador
    const addPlayer = async () => {
        try {
            const newPlayerRef = doc(firestore, 'jugadores', newPlayer.id);
            await setDoc(newPlayerRef, newPlayer);
            setPlayers(prev => [...prev, newPlayer]);
            setFilteredPlayers(prev => [...prev, newPlayer]);
            setNewPlayer({
                id: '',
                name: '',
                ppg: null,
                rpg: null,
                apg: null,
                height: '',
                weight: '',
                age: null,
                image: '',
            });
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error adding player:', error);
        }
    };

    // Editar jugador
    const saveChanges = async () => {
        if (!editedPlayer || !editedPlayer.id) return;

        try {
            const playerRef = doc(firestore, `jugadores/${editedPlayer.id}`);
            await updateDoc(playerRef, editedPlayer);
            setPlayers(prev =>
                prev.map(player => (player.id === editedPlayer.id ? { ...editedPlayer } : player))
            );
            setFilteredPlayers(prev =>
                prev.map(player => (player.id === editedPlayer.id ? { ...editedPlayer } : player))
            );
            setIsEditing(false);
            setEditedPlayer(null);
        } catch (error) {
            console.error('Error updating player:', error);
        }
    };

    // Eliminar jugador
    const deletePlayer = async (playerId: string) => {
        try {
            const playerRef = doc(firestore, `jugadores/${playerId}`);
            await deleteDoc(playerRef);
            setPlayers(prev => prev.filter(player => player.id !== playerId));
            setFilteredPlayers(prev => prev.filter(player => player.id !== playerId));
        } catch (error) {
            console.error('Error deleting player:', error);
        }
    };

    return (
        <div className="container mt-5">
            {/* Filtros */}
            <div className="row mb-4">
                <div className="col-md-5">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar jugador por nombre"
                        value={filterTerm}
                        onChange={(e) => setFilterTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-5">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Buscar jugador por edad"
                        value={filterAge ?? ''}
                        onChange={(e) => setFilterAge(e.target.value ? parseInt(e.target.value) : null)}
                    />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary w-100" onClick={filterPlayers}>
                        Filtrar
                    </button>
                </div>
            </div>

            {/* Botón para abrir formulario */}
            <button className="open-form" onClick={() => setIsFormOpen(true)}>
                Añadir Jugador
            </button>

            {/* Formulario de nuevo jugador */}
            {isFormOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h5>Añadir Jugador</h5>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addPlayer();
                            }}
                        >
                            {/* Campos */}
                            {Object.keys(newPlayer).map((key) => (
                                <div key={key}>
                                    <label>{key.toUpperCase()}</label>
                                    <input
                                        type="text"
                                        value={newPlayer[key as keyof typeof newPlayer] ?? ''}
                                        onChange={(e) =>
                                            setNewPlayer((prev) => ({
                                                ...prev,
                                                [key]: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            ))}
                            <button type="submit">Guardar</button>
                            <button type="button" onClick={() => setIsFormOpen(false)}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Lista de jugadores */}
            <div className="row">
                {filteredPlayers.map((player) => (
                    <div key={player.id} className="col-md-3">
                        <div className="card">
                            <h5>{player.name}</h5>
                            <button onClick={() => deletePlayer(player.id)}>Eliminar</button>
                            <button onClick={() => setEditedPlayer(player)}>Editar</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de edición */}
            {isEditing && editedPlayer && (
                <div className="modal">
                    <div className="modal-content">
                        <h5>Editar Jugador</h5>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                saveChanges();
                            }}
                        >
                            {/* Campos */}
                            {Object.keys(editedPlayer).map((key) => (
                                <div key={key}>
                                    <label>{key.toUpperCase()}</label>
                                    <input
                                        type="text"
                                        value={editedPlayer[key as keyof typeof editedPlayer] ?? ''}
                                        onChange={(e) =>
                                            setEditedPlayer((prev: any) => ({
                                                ...prev,
                                                [key]: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            ))}
                            <button type="submit">Guardar</button>
                            <button type="button" onClick={() => setIsEditing(false)}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

