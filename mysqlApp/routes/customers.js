var express = require('express')
var app = express()
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM Donuts541DB.Customer ORDER BY Id DESC',function(err, rows, fields) {
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

app.get('/add', function(req, res, next){
	res.render('employee/add', {
		title: "Add New Employee",
		Name: 'Enter Employee Name',
		Address: 'Enter Employee Code',
		ID: 'Enter Address'
	})
})

app.post('/add', function(req, res, next){	
	req.assert('Name', 'Donut Name is required').notEmpty()
	req.assert('Code', 'Code is required').notEmpty()
    req.assert('Address', 'An Address is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {  
		
		var employee = {
			Name: req.sanitize('Name').escape().trim(),
			Code: req.sanitize('Code').escape().trim(),
			Address: req.sanitize('Address').escape().trim()
		}
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO Donuts541DB.Employee SET ?', employee, function(err, result) {
				if (err) {
					res.render('employee/add', {
						title: 'Add New Employee',
						Name: employee.Name,
						Code: employee.Code,
						Address: employee.Address					
					})
				} else {				
					res.render('employee/add', {
						title: 'Add New Employee',
						Name: '',
						Code: '',
						Address: ''					
					})
				}
			})
		})
	}
	else {		
        res.render('employee/add', { 
            title: 'Add New Employee',
            Name: req.body.Name,
            Code: req.body.Code,
            Address: req.body.Address
        })
    }
})

app.get('/edit/(:Id)', function(req, res, next){
	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM Donuts541DB.Employee WHERE Id = ' + req.params.Id, function(err, rows, fields){
			if(rows.length <= 0){ // sadness
				res.redirect('/employees')
			}
			else{
				res.render('employee/edit', {
					title: 'Edit Employee',
					Id: rows[0].Id,
					Name: rows[0].Name,
					Code: rows[0].Code,
					Address: rows[0].Address
				})
			}
		})	
	})
})

app.put('/edit/(:Id)', function(req, res, next) {
	req.assert('Name', 'Name is required').notEmpty()
	req.assert('Code', 'Code is required').notEmpty()
    req.assert('Address', 'A valid price is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {
		var employee = {
			Name: req.sanitize('Name').escape().trim(),
			Code: req.sanitize('Code').escape().trim(),
			Address: req.sanitize('Address').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE Donuts541DB.Employee SET ? WHERE Id = ' + req.params.Id, employee, function(err, result) {
				if (err) {
					res.render('employee/edit', {
						title: 'Edit Employee',
						Id: req.params.Id,
						Name: req.body.Name,
						Code: req.body.Code,
						Address: req.body.Address
					})
				} else {
					res.render('employee/edit', {
						title: 'Edit Employee',
						Id: req.params.Id,
						Name: req.body.Name,
						Code: req.body.Code,
						Address: req.body.Address
					})
				}
			})
		})
	}
	else {
        res.render('employee/edit', { 
            title: 'Edit Employee',            
			Id: req.params.Id, 
			Name: req.body.Name,
			Code: req.body.Code,
			Address: req.body.Address
        })
    }
})

app.delete('/delete/(:Id)', function(req, res, next) {
	var employee = { Id: req.params.Id }
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM Donuts541DB.Employee WHERE Id = ' + req.params.Id, employee, function(err, result) {
			if (err) {
				res.redirect('/employees')
			} else {
				res.redirect('/employees')
			}
		})
	})
})

module.exports = app