import React, { ChangeEvent, useEffect, useState } from 'react'
import { Container, Typography, TextField, Button, Select, InputLabel, MenuItem, FormControl, FormHelperText } from "@material-ui/core"
import './CadastroPost.css';
import { useHistory, useParams } from 'react-router-dom';
/*import Categoria from '../../../models/Categoria'; */
import useLocalStorage from 'react-use-localstorage';

import { busca, buscaId, post, put } from '../../../services/Service';

function CadastroProduto() {
    let history = useHistory();
    const { id } = useParams<{ id: string }>();
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [token, setToken] = useLocalStorage('token');

    useEffect(() => {
        if (token == "") {
            alert("Você precisa estar logado")
            history.push("/login")

        }
    }, [token])

    const [categoria, setCategoria] = useState<Categoria>(
        {
            id: 0,
            nomec: '',
            descricaoc: ''
        })
    const [produto, setProduto] = useState<Produto>({
        id: 0,
        nomep: '',
        descricao: '',
        preço: '',
        duracao: ''
        categoria: null
    })

    useEffect(() => { 
        setProduto({
            ...produto,
            categoria: categoria
        })
    }, [categoria])

    useEffect(() => {
        getCategorias()
        if (id !== undefined) {
            findByIdProduto(id)
        }
    }, [id])

    async function getCategorias() {
        await busca('/categoria', setCategorias, {
            headers: {
                'Authorization': token
            }
        })
    }

    async function findByIdProduto(id: string) {
        await buscaId('/produtos/${id}', setProduto, {
            headers: {
                'Authorization': token
            }
        })
    }

    function updatedProduto(e: ChangeEvent<HTMLInputElement>) {

        setProduto({
            ...produto,
            [e.target.name]: e.target.value,
            categoria: categoria
        })

    }

    async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()

        if (id !== undefined) {
            put('/produtos', produto, setProduto, {
                headers: {
                    'Authorization': token
                }
            })
            alert('Produto cadastrado');
        } else {
            post('/produto', produto, setProduto, {
                headers: {
                    'Authorization': token
                }
            })
            alert('Produto atuaizado com sucesso');
        }
        back()

    }

    function back() {
        history.push('/produto')
    }

    return (
        <Container maxWidth="sm" className="topo">
            <form onSubmit={onSubmit}>
                <Typography variant="h3" color="textSecondary" component="h1" align="center" >Formulário de cadastro de produtos</Typography>
                <TextField value={produto.titulo} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="titulo" label="titulo" variant="outlined" name="titulo" margin="normal" fullWidth />
                <TextField value={produto.texto} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="texto" label="texto" name="texto" variant="outlined" margin="normal" fullWidth />

                <FormControl >
                    <InputLabel id="demo-simple-select-helper-label">Tema </InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        onChange={(e) => buscaId('/categoria/${e.target.value}`, setCategoria, {
                            headers: {
                                'Authorization': token
                            }
                        })}>
                        {
                            categorias.map(categoria => (
                                <MenuItem value={categoria.id}>{categoria.descricaoc}</MenuItem>
                            ))
                        }
                    </Select>
                    <FormHelperText>Escolha uma categoria para prodtos</FormHelperText>
                    <Button type="submit" variant="contained" color="primary">
                        Finalizar
                    </Button>
                </FormControl>
            </form>
        </Container>
    )
}
export default CadastroProduto;