import { React, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles, AppBar, Toolbar, IconButton, Typography, MenuItem, Menu, Button } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HomeIcon from '@material-ui/icons/Home';
import MoreIcon from '@material-ui/icons/MoreVert';
import CartWidget from './CartWidget';
import OrderSearchPopOver from './OrderSearchPopOver';
import UserPopOver from './UserPopOver';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/FirebaseClient';
import { AuthContext } from '../context/AuthContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    background : '#2E3B55',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function NavBar() {

  const classes = useStyles();

  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
        

    const getCategories = async () => {
      const categoriesCollection = collection(db, 'categorias');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      setCategories(categoriesSnapshot.docs.map(doc => ({...doc.data()})));
    };

    getCategories();

}, []);


  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'menu-tienda';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link to={`/category/todas`} style={{ textDecoration: 'none', color: 'black', }}>
        <MenuItem key='todas' onClick={handleMenuClose}>Todas</MenuItem>
      </Link>

      {categories.map((category) => (
      <>
      <Link to={`/category/${category.shortname}`} style={{ textDecoration: 'none', color: 'black', }}>
        <MenuItem key={category.shortname} onClick={handleMenuClose}>{category.name}</MenuItem>
      </Link>
      </>
      ) )}

    
    </Menu>
  );

  const mobileMenuId = 'menu-tienda-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem keyy="categorias" onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-tienda"
          aria-haspopup="true"
          color="inherit"
        >
          <ArrowDropDownIcon />
        </IconButton>
        <p>Categorías</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar 
        className={classes.appBar}
        position="static">
        <Toolbar>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', }}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="ir a home"
          >
            <HomeIcon />
          </IconButton>
          </Link>
          <Link to="/" style={{ textDecoration: 'none', color: 'white', }}>
            <Typography className={classes.title} variant="h6" noWrap>
              ProntasApps
            </Typography>
          </Link>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
          
          <OrderSearchPopOver/>
            <Button edge="end"
              aria-label="categorías de la tienda"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit" 
              >Categorías
              <ArrowDropDownIcon />
              </Button>
          </div>
          <CartWidget/>
          <UserPopOver/>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="ver más"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>

          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}