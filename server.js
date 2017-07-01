var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var _ = require('lodash');
var cors = require('cors');
var expressJwt = require('express-jwt');
var config = require('./config.json');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();
app.use(bodyParser.json());

var db;

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(expressJwt({
    secret: config.secret,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({ path: ['/users/authenticate', '/users/register'] }));

// Conexao a base
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log("DB Connection ok");

  // Inicializando app
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("app running on ", port);
  });
});

// ROUTES
//Error handler
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/empresas"
 *    GET: todas empresas
 *    POST: nova empresa
 */

app.get("/api/empresas", function(req, res) {
	db.collection("empresas").find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Falha ao encontrar empresas.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/empresas", function(req, res) {
  var newEmpresa = req.body;

  if (!req.body.nomeFantasia) {
    handleError(res, "Entrada inválida!", "Necessário informar o nome", 400);
  }

  db.collection("empresas").insertOne(newEmpresa, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Falha ao criar nova empresa.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/api/empresas/:id"
 *    GET: empresa pelo id
 *    PUT: atualiza empresa pelo id
 *    DELETE: deleta empresa pelo id
 */

app.get("/api/empresas/:id", function(req, res) {
	db.collection("empresas").findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Falaha ao encontrar a empresa.");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/empresas/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;
  db.collection("empresas").updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Falha ao atualizar a empresa.");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/empresas/:id", function(req, res) {
	db.collection("empresas").deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Falha ao deletar a empresa.");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});

//auth
app.post('/users/authenticate', function(req, res) {
  db.collection("users").findOne({ email: req.body.email }, function(err, user) {
    if (err) {
      handleError(res, err.message, 'Falha ao efetuar login.');
    }
    else {
			if (req.body.senha) {
				if (user && bcrypt.compareSync(req.body.senha, user.hash)) {
						// autenticacao ok
						user.token = jwt.sign({ sub: user._id }, config.secret);
						res.status(200).json(user);
				} else {
						// autenticacao fail
						res.status(400).send('E-mail ou senha estão incorretos!');
				}
			}
			else {
				if (user && req.body.hash === user.hash) {
						// autenticacao ok
						user.token = jwt.sign({ sub: user._id }, config.secret);
						res.status(200).json(user);
				} else {
						// autenticacao fail
						res.status(400).send('Problema na autenticação!');
				}
			}
    }

  });
});
app.post('/users/register', function(req, res) {
  // validacao
  db.collection('users').findOne(
      { email: req.body.email },
      function (err, user) {
          if (err) handleError(res, err.message, 'Falha ao efetuar registro.');

          if (user) {
              // email existente
              res.status(400).send('E-mail já encontra-se em nosso sistema!');
          } else {
              createUser();
          }
      });

  function createUser() {
      // sem senha cleartext
      var user = _.omit(req.body, 'senha');

      // add hash
      user.hash = bcrypt.hashSync(req.body.senha, 10);

      db.collection("users").insertOne(user, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Falha ao criar novo usuário.");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
  }
});
app.get('/users', function(req, res) {
  db.collection('users').find().toArray(function (err, users) {
      if (err) handleError(res, err.message, "Falha ao buscar usuários.");

      users = _.map(users, function (user) {
          return _.omit(user, 'hash');
      });

      res.status(200).json(users);
  });
});
app.get('/users/current', function(req, res) {
  db.collection('users').findById(req.user.sub, function (err, user) {
      if (err) handleError(res, err.message, "Falha ao buscar usuários.");

      if (user) {
          //sem senha
          res.status(201).json(_.omit(user, 'hash'));
      } else {
          //nenhum encontrado
          res.status(400).send('Usuário não encontrado.');
      }
  });
});
app.put('/users/:id', function(req, res) {
  // validation
  db.collection("users").findOne({ _id: new ObjectID(req.body._id) }, function(err, user) {
      if (err) handleError(res, err.message, "Falha ao atualizar usuário.");
      if (user.email !== req.body.email) {
          // usuario alterou email
          db.collection('users').findOne(
              { email: req.body.email },
              function (err, user) {
                  if (err) handleError(res, err.message, "Falha ao atualizar usuário.");

                  if (user) {
                      // email já existe
                      res.status(400).send('E-mail já encontra-se em nosso sistema!');
                  } else {
                      updateUser();
                  }
              });
      } else {
          updateUser();
      }
  });

  function updateUser() {
      var set = {
        email: req.body.email
      };

      // caso alterado senha
      if (req.body.senha) {
        set.hash = bcrypt.hashSync(req.body.senha, 10);
      }
      db.collection("users").updateOne({_id: new ObjectID(req.body._id)}, set, function(err, doc) {
        if (err) handleError(res, err.message, "Falha ao atualizar usuário.");
        else res.status(200).json(doc);
      });
  }
});
app.delete('/users/:id', function(req, res) {
  db.collection('users').remove(
    { _id: mongo.helper.toObjectID(req.body._id) },
    function (err) {
        if (err) handleError(res, err.message, "Falha ao remover usuário.");
        res.status(200).json(req.params.id);
    });
});
