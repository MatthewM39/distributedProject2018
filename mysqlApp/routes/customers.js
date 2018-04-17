var express = require('express')
var app = express()
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM Donuts541DB.Customer ORDER BY id DESC',function(err, rows, fields) {
			if (err) {
				res.render('customer/list', {
					title: 'Customer List', 
					data: ''
				})
			} else {
				res.render('customer/list', {
					title: 'Customer List', 
					data: rows
				})
			}
		})
	})
})
//
app.get('/add', function(req, res, next){
	res.render('customer/add', {
		title: "Add New Customer",
		Name: 'Enter Customer Name',
		Address: 'Enter Customer Address',
	})
})

app.post('/add', function(req, res, next){	
	req.assert('Name', 'Customer Name is required').notEmpty()
    req.assert('Address', 'An Address is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {  
		
		var employee = {
			Name: req.sanitize('Name').escape().trim(),
			Address: req.sanitize('Address').escape().trim()
		}
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO Donuts541DB.Customer SET ?', customer, function(err, result) {
				if (err) {
					res.render('customer/add', {
						title: 'Add New Customer',
						Name: customer.Name,
						Address: customer.Address					
					})
				} else {				
					res.render('customer/add', {
						title: 'Add New Customer',
						Name: '',
						Address: ''					
					})
				}
			})
		})
	}
	else {		
        res.render('customer/add', { 
            title: 'Add New Customer',
            Name: req.body.Name,
            Address: req.body.Address
        })
    }
})

app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM Donuts541DB.Customer WHERE id = ' + req.params.id, function(err, rows, fields){
			if(rows.length <= 0){ // sadness
				res.redirect('/customers')
			}
			else{
				res.render('customer/edit', {
					title: 'Edit Customer',
					id: rows[0].id,
					Name: rows[0].Name,
					Address: rows[0].Address
				})
			}
		})	
	})
})

app.put('/edit/(:id)', function(req, res, next) {
	req.assert('Name', 'Name is required').notEmpty()
    req.assert('Address', 'A valid address is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {
		var customer = {
			Name: req.sanitize('Name').escape().trim(),
			Address: req.sanitize('Address').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE Donuts541DB.Customer SET ? WHERE id = ' + req.params.Id, customer, function(err, result) {
				if (err) {
					res.render('customer/edit', {
						title: 'Edit Customer',
						id: req.params.id,
						Name: req.body.Name,
						Address: req.body.Address
					})
				} else {
					res.render('customer/edit', {
						title: 'Edit Customer',
						Id: req.params.Id,
						Name: req.body.Name,
						Address: req.body.Address
					})
				}
			})
		})
	}
	else {
        res.render('customer/edit', { 
            title: 'Edit Customer',            
			id: req.params.id, 
			Name: req.body.Name,
			Address: req.body.Address
        })
    }
})

app.delete('/delete/(:id)', function(req, res, next) {
	var customer = { id: req.params.id }
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM Donuts541DB.Customer WHERE id = ' + req.params.id, customer, function(err, result) {
			if (err) {
				res.redirect('/customers')
			} else {
				res.redirect('/customers')
			}
		})
	})
})

module.exports = app