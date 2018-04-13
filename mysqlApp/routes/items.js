var express = require('express')
var app = express()
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM Donuts541DB.Item ORDER BY Id DESC',function(err, rows, fields) {
			if (err) {
				res.render('item/list', {
					title: 'Donut List', 
					data: ''
				})
			} else {
				res.render('item/list', {
					title: 'Donut List', 
					data: rows
				})
			}
		})
	})
})

app.get('/add', function(req, res, next){
	res.render('item/add', {
		title: "Add New Donut",
		Name: 'Enter Donut Name',
		Code: 'Enter Item Code',
		Price: 'Enter Price'
	})
})

app.post('/add', function(req, res, next){	
	req.assert('Name', 'Donut Name is required').notEmpty()
	req.assert('Code', 'Code is required').notEmpty()
    req.assert('Price', 'A price is required').isDecimal()

    var errors = req.validationErrors()
    
    if( !errors ) {  
		
		var item = {
			Name: req.sanitize('Name').escape().trim(),
			Code: req.sanitize('Code').escape().trim(),
			Price: req.sanitize('Price').escape().trim()
		}
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO Donuts541DB.Item SET ?', item, function(err, result) {
				if (err) {
					res.render('item/add', {
						title: 'Add New Donut',
						Name: item.Name,
						Code: item.Code,
						Price: item.Price					
					})
				} else {				
					res.render('item/add', {
						title: 'Add New Donut',
						Name: '',
						Code: '',
						Price: ''					
					})
				}
			})
		})
	}
	else {		
        res.render('item/add', { 
            title: 'Add New Donut',
            Name: req.body.Name,
            Code: req.body.Code,
            Price: req.body.Price
        })
    }
})

app.get('/edit/(:Id)', function(req, res, next){
	req.getConnection(function(error, conn){
		conn.query('SELECT * FROM Donuts541DB.Item WHERE Id = ' + req.params.Id, function(err, rows, fields){
			if(rows.length <= 0){ // sadness
				res.redirect('/items')
			}
			else{
				res.render('item/edit', {
					title: 'Edit Donut',
					Id: rows[0].Id,
					Name: rows[0].Name,
					Code: rows[0].Code,
					Price: rows[0].Price
				})
			}
		})	
	})
})

app.put('/edit/(:Id)', function(req, res, next) {
	req.assert('Name', 'Name is required').notEmpty()
	req.assert('Code', 'Code is required').notEmpty()
    req.assert('Price', 'A valid price is required').isDecimal()

    var errors = req.validationErrors()
    
    if( !errors ) {
		var item = {
			Name: req.sanitize('Name').escape().trim(),
			Code: req.sanitize('Code').escape().trim(),
			Price: req.sanitize('Price').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE Donuts541DB.Item SET ? WHERE Id = ' + req.params.Id, item, function(err, result) {
				if (err) {
					res.render('item/edit', {
						title: 'Edit Donut',
						Id: req.params.Id,
						Name: req.body.Name,
						Code: req.body.Code,
						Price: req.body.Price
					})
				} else {
					res.render('item/edit', {
						title: 'Edit Donut',
						Id: req.params.Id,
						Name: req.body.Name,
						Code: req.body.Code,
						Price: req.body.Price
					})
				}
			})
		})
	}
	else {
        res.render('item/edit', { 
            title: 'Edit Donut',            
			Id: req.params.Id, 
			Name: req.body.Name,
			Code: req.body.Code,
			Price: req.body.Price
        })
    }
})

app.delete('/delete/(:Id)', function(req, res, next) {
	var item = { Id: req.params.Id }
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM Donuts541DB.Item WHERE Id = ' + req.params.Id, item, function(err, result) {
			if (err) {
				res.redirect('/items')
			} else {
				res.redirect('/items')
			}
		})
	})
})

module.exports = app