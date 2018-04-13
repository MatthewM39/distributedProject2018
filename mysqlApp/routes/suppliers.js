var express = require('express')
var app = express()
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM Donuts541DB.Supplier ORDER BY id DESC',function(err, rows, fields) {
			if (err) {
				res.render('supplier/list', {
					title: 'Supplier List', 
					data: ''
				})
			} else {
				res.render('supplier/list', {
					title: 'Supplier List', 
					data: rows
				})
			}
		})
	})
})

app.get('/add', function(req, res, next){
	res.render('supplier/add', {
		title: "Add New Supplier",
		Name: 'Enter Supplier Name',
		Site_URL: 'Enter Suplier Address',
	})
})

app.post('/add', function(req, res, next){	
	req.assert('Name', 'Supplier Name is required').notEmpty()
    req.assert('Site_URL', 'An Address is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {  
		
		var employee = {
			Name: req.sanitize('Name').escape().trim(),
			Site_URL: req.sanitize('Site_URL').escape().trim()
		}
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO Donuts541DB.Supplier SET ?', supplier, function(err, result) {
				if (err) {
					res.render('supplier/add', {
						title: 'Add New Supplier',
						Name: supplier.Name,
						Site_URL: supplier.Site_URL					
					})
				} else {				
					res.render('supplier/add', {
						title: 'Add New Supplier',
						Name: '',
						Site_URL: ''					
					})
				}
			})
		})
	}
	else {		
        res.render('supplier/add', { 
            title: 'Add New Supplier',
            Name: req.body.Name,
            Site_URL: req.body.Site_URL
        })
    }
})

app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM Donuts541DB.Supplier WHERE id = ' + req.params.id, function(err, rows, fields){
			if(rows.length <= 0){ // sadness
				res.redirect('/suppliers')
			}
			else{
				res.render('supplier/edit', {
					title: 'Edit Supplier',
					id: rows[0].id,
					Name: rows[0].Name,
					Site_URL: rows[0].Site_URL
				})
			}
		})	
	})
})

app.put('/edit/(:id)', function(req, res, next) {
	req.assert('Name', 'Name is required').notEmpty()
    req.assert('Site_URL', 'A valid URL is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {
		var supplier = {
			Name: req.sanitize('Name').escape().trim(),
			Site_URL: req.sanitize('Site_URL').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE Donuts541DB.Supplier SET ? WHERE id = ' + req.params.Id, supplier, function(err, result) {
				if (err) {
					res.render('supplier/edit', {
						title: 'Edit Supplier',
						id: req.params.id,
						Name: req.body.Name,
						Site_URL: req.body.Site_URL
					})
				} else {
					res.render('supplier/edit', {
						title: 'Edit Supplier',
						Id: req.params.Id,
						Name: req.body.Name,
						Site_URL: req.body.Site_URL
					})
				}
			})
		})
	}
	else {
        res.render('supplier/edit', { 
            title: 'Edit Supplier',            
			id: req.params.id, 
			Name: req.body.Name,
			Site_URL: req.body.Site_URL
        })
    }
})

app.delete('/delete/(:id)', function(req, res, next) {
	var supplier = { id: req.params.id }
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM Donuts541DB.Supplier WHERE id = ' + req.params.id, supplier, function(err, result) {
			if (err) {
				res.redirect('/suppliers')
			} else {
				res.redirect('/suppliers')
			}
		})
	})
})

module.exports = app